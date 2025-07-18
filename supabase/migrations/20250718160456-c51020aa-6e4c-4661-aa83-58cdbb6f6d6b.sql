-- Criar buckets de storage necessários para funcionalidade completa
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('uploads', 'uploads', true),
  ('course-images', 'course-images', true),
  ('user-content', 'user-content', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para bucket uploads
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view files" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow admins to delete files from uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'uploads' AND 
  is_admin(auth.uid())
);

-- Políticas para bucket course-images
CREATE POLICY "Allow admins to upload course images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-images' AND 
  is_admin(auth.uid())
);

CREATE POLICY "Allow public to view course images" ON storage.objects
FOR SELECT USING (bucket_id = 'course-images');

CREATE POLICY "Allow admins to delete course images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-images' AND 
  is_admin(auth.uid())
);

-- Políticas para bucket user-content  
CREATE POLICY "Allow users to upload their own content" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-content' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to view their own content" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-content' AND 
  (
    (storage.foldername(name))[1] = auth.uid()::text OR 
    is_admin(auth.uid())
  )
);

CREATE POLICY "Allow users to delete their own content" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-content' AND 
  (
    (storage.foldername(name))[1] = auth.uid()::text OR 
    is_admin(auth.uid())
  )
);