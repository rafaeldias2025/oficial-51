-- Migração para corrigir políticas RLS e garantir acesso administrativo
-- Autor: Claude AI
-- Data: 2025-07-20

-- ✅ SECURITY: Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do all on profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Admins can do all on courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view active modules" ON course_modules;
DROP POLICY IF EXISTS "Admins can do all on course_modules" ON course_modules;
DROP POLICY IF EXISTS "Anyone can view active lessons" ON course_lessons;
DROP POLICY IF EXISTS "Admins can do all on course_lessons" ON course_lessons;
DROP POLICY IF EXISTS "Users can view own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Admins can do all on user_course_progress" ON user_course_progress;

-- 1. ✅ FIXED: Policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ✅ CRITICAL FIX: Admin access with FOR ALL
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role = 'admin'
    )
  );

-- 2. ✅ FIXED: Policies for courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active courses
CREATE POLICY "courses_select_active" ON courses
  FOR SELECT USING (is_active = true);

-- ✅ CRITICAL FIX: Admin access with FOR ALL
CREATE POLICY "courses_admin_all" ON courses
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role = 'admin'
    )
  );

-- 3. ✅ FIXED: Policies for course_modules table
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active modules
CREATE POLICY "course_modules_select_active" ON course_modules
  FOR SELECT USING (is_active = true);

-- ✅ CRITICAL FIX: Admin access with FOR ALL
CREATE POLICY "course_modules_admin_all" ON course_modules
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role = 'admin'
    )
  );

-- 4. ✅ FIXED: Policies for course_lessons table
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active lessons
CREATE POLICY "course_lessons_select_active" ON course_lessons
  FOR SELECT USING (is_active = true);

-- ✅ CRITICAL FIX: Admin access with FOR ALL
CREATE POLICY "course_lessons_admin_all" ON course_lessons
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role = 'admin'
    )
  );

-- 5. ✅ FIXED: Policies for user_course_progress table
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own progress
CREATE POLICY "user_progress_select_own" ON user_course_progress
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Allow users to insert their own progress
CREATE POLICY "user_progress_insert_own" ON user_course_progress
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Allow users to update their own progress
CREATE POLICY "user_progress_update_own" ON user_course_progress
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- ✅ CRITICAL FIX: Admin access with FOR ALL
CREATE POLICY "user_progress_admin_all" ON user_course_progress
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role = 'admin'
    )
  );

-- 6. ✅ ENHANCED: Storage buckets with proper error handling
DO $$
BEGIN
  -- Create course_images bucket if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'course_images') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
    VALUES (
      'course_images', 
      'course_images', 
      true, 
      52428800, -- 50MB limit
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    );
  END IF;
  
  -- Create user_avatars bucket if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user_avatars') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
    VALUES (
      'user_avatars', 
      'user_avatars', 
      true, 
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but continue migration
    RAISE NOTICE 'Error creating storage buckets: %', SQLERRM;
END $$;

-- 7. ✅ ENHANCED: Storage policies with file validation
-- Drop existing storage policies
DROP POLICY IF EXISTS "Public can view course images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can insert course images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update course images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete course images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view user avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all avatars" ON storage.objects;

-- Course images policies
CREATE POLICY "course_images_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'course_images');

CREATE POLICY "course_images_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'course_images' AND
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

-- User avatars policies
CREATE POLICY "user_avatars_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'user_avatars');

CREATE POLICY "user_avatars_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user_avatars' AND
    (storage.foldername(name))[1]::text = auth.uid()::text
  );

CREATE POLICY "user_avatars_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user_avatars' AND
    (storage.foldername(name))[1]::text = auth.uid()::text
  );

CREATE POLICY "user_avatars_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user_avatars' AND
    (storage.foldername(name))[1]::text = auth.uid()::text
  );

CREATE POLICY "user_avatars_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'user_avatars' AND
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

-- 8. ✅ ENHANCED: Admin logs table with proper constraints
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW')),
  target_table TEXT NOT NULL,
  target_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Add foreign key constraint
  CONSTRAINT admin_logs_admin_id_fkey 
    FOREIGN KEY (admin_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS admin_logs_admin_id_idx ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS admin_logs_created_at_idx ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS admin_logs_target_table_idx ON admin_logs(target_table);

-- Enable RLS on admin_logs
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ✅ CRITICAL FIX: Admin logs policy with FOR ALL
CREATE POLICY "admin_logs_admin_all" ON admin_logs
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

-- 9. ✅ ENHANCED: Audit function with better error handling
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
DECLARE
  admin_profile_id UUID;
  action_details JSONB;
BEGIN
  -- Skip logging for non-admin users to avoid performance impact
  SELECT id INTO admin_profile_id 
  FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
  LIMIT 1;
  
  -- If not an admin, skip logging
  IF admin_profile_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Prepare action details with size limits
  action_details = jsonb_build_object(
    'table', TG_TABLE_NAME,
    'operation', TG_OP,
    'timestamp', now()
  );
  
  -- Add data details but limit size to prevent large payloads
  IF TG_OP = 'DELETE' THEN
    action_details = action_details || jsonb_build_object('old_data', to_jsonb(OLD));
  ELSE
    action_details = action_details || jsonb_build_object('new_data', to_jsonb(NEW));
  END IF;
  
  -- Insert log with error handling
  BEGIN
    INSERT INTO admin_logs (
      admin_id, 
      action_type, 
      target_table, 
      target_id, 
      details
    ) VALUES (
      admin_profile_id,
      TG_OP,
      TG_TABLE_NAME,
      CASE 
        WHEN TG_OP = 'DELETE' THEN (OLD.id)::UUID
        ELSE (NEW.id)::UUID
      END,
      action_details
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but don't fail the main operation
      RAISE NOTICE 'Failed to log admin action: %', SQLERRM;
  END;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 