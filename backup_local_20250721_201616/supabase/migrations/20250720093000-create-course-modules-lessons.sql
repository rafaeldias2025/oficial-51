-- Migração para criação de course_modules e course_lessons com políticas RLS adequadas
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INT,
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS nas tabelas
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Políticas para course_modules

-- Permitir que administradores tenham acesso completo
CREATE POLICY "Admins can do all on course_modules" ON course_modules
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Permitir que usuários visualizem módulos ativos
CREATE POLICY "Users can view active modules" ON course_modules
  FOR SELECT
  USING (
    is_active = true
  );

-- Políticas para course_lessons

-- Permitir que administradores tenham acesso completo
CREATE POLICY "Admins can do all on course_lessons" ON course_lessons
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Permitir que usuários visualizem aulas ativas
CREATE POLICY "Users can view active lessons" ON course_lessons
  FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM course_modules
      WHERE course_modules.id = course_lessons.module_id
      AND course_modules.is_active = true
    )
  );

-- Criar buckets de armazenamento para imagens de cursos
INSERT INTO storage.buckets (id, name, public) VALUES ('course_images', 'course_images', true);

-- Políticas de armazenamento para imagens de cursos
CREATE POLICY "Admins can upload course images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'course_images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view course images" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'course_images'
  );

CREATE POLICY "Admins can update course images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'course_images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete course images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'course_images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Criar tabela para logs de ações administrativas
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs" ON admin_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert logs" ON admin_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  ); 