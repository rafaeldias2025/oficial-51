-- =====================================================
-- MIGRAÇÃO PARA CONFIGURAR BUCKETS DE STORAGE E POLÍTICAS RLS
-- =====================================================

-- Criar bucket para uploads gerais (admin e curso media)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public;

-- Criar bucket para avatares de usuários
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public;

-- Criar bucket para capas de cursos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-covers', 'course-covers', true)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public;

-- Criar bucket para vídeos de aulas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-videos', 'course-videos', true)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public;

-- Criar bucket para materiais de apoio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public;

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'uploads' (uso geral admin)
-- =====================================================

-- Todos podem visualizar uploads públicos
CREATE POLICY "Public can view uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

-- Apenas admins podem fazer upload no bucket uploads
CREATE POLICY "Admins can upload to uploads bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'uploads' AND 
  is_admin(auth.uid())
);

-- Apenas admins podem atualizar arquivos no bucket uploads
CREATE POLICY "Admins can update uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'uploads' AND 
  is_admin(auth.uid())
);

-- Apenas admins podem deletar arquivos do bucket uploads
CREATE POLICY "Admins can delete from uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'uploads' AND 
  is_admin(auth.uid())
);

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'avatars' (avatares de usuários)
-- =====================================================

-- Todos podem visualizar avatares
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Usuários podem fazer upload do próprio avatar
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem atualizar o próprio avatar
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem deletar o próprio avatar
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins podem gerenciar todos os avatares
CREATE POLICY "Admins can manage all avatars" ON storage.objects
FOR ALL USING (
  bucket_id = 'avatars' AND 
  is_admin(auth.uid())
);

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'course-covers' (capas de cursos)
-- =====================================================

-- Todos podem visualizar capas de cursos
CREATE POLICY "Public can view course covers" ON storage.objects
FOR SELECT USING (bucket_id = 'course-covers');

-- Apenas admins podem gerenciar capas de cursos
CREATE POLICY "Admins can manage course covers" ON storage.objects
FOR ALL USING (
  bucket_id = 'course-covers' AND 
  is_admin(auth.uid())
);

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'course-videos' (vídeos de aulas)
-- =====================================================

-- Todos podem visualizar vídeos de cursos (para now - implementar later controle de acesso por curso)
CREATE POLICY "Public can view course videos" ON storage.objects
FOR SELECT USING (bucket_id = 'course-videos');

-- Apenas admins podem gerenciar vídeos de cursos
CREATE POLICY "Admins can manage course videos" ON storage.objects
FOR ALL USING (
  bucket_id = 'course-videos' AND 
  is_admin(auth.uid())
);

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'course-materials' (materiais de apoio)
-- =====================================================

-- Todos podem visualizar materiais de cursos
CREATE POLICY "Public can view course materials" ON storage.objects
FOR SELECT USING (bucket_id = 'course-materials');

-- Apenas admins podem gerenciar materiais de cursos
CREATE POLICY "Admins can manage course materials" ON storage.objects
FOR ALL USING (
  bucket_id = 'course-materials' AND 
  is_admin(auth.uid())
);

-- =====================================================
-- FUNÇÕES AUXILIARES PARA STORAGE
-- =====================================================

-- Função para obter informações do arquivo
CREATE OR REPLACE FUNCTION get_file_info(bucket_name text, file_path text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  file_info jsonb;
BEGIN
  SELECT to_jsonb(objects.*)
  INTO file_info
  FROM storage.objects
  WHERE bucket_id = bucket_name AND name = file_path;
  
  RETURN file_info;
END;
$$;

-- Função para limpar arquivos órfãos (sem referência)
CREATE OR REPLACE FUNCTION cleanup_orphaned_files(bucket_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- Esta função seria expandida para identificar arquivos órfãos
  -- Por exemplo, capas de cursos que não estão referenciadas na tabela courses
  
  -- Placeholder implementation
  RAISE NOTICE 'Cleanup function called for bucket: %', bucket_name;
  
  RETURN deleted_count;
END;
$$;

-- =====================================================
-- TRIGGERS E FUNÇÕES PARA SINCRONIZAÇÃO
-- =====================================================

-- Função para atualizar URL de imagem quando curso é criado/atualizado
CREATE OR REPLACE FUNCTION update_course_image_url()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Se image_url está vazio, usar placeholder baseado na categoria
  IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
    NEW.image_url = CASE NEW.category
      WHEN 'fitness' THEN 'https://via.placeholder.com/400x600/10B981/ffffff?text=Fitness'
      WHEN 'nutrition' THEN 'https://via.placeholder.com/400x600/F59E0B/ffffff?text=Nutrition'
      WHEN 'mindfulness' THEN 'https://via.placeholder.com/400x600/8B5CF6/ffffff?text=Mindfulness'
      WHEN 'psychology' THEN 'https://via.placeholder.com/400x600/EF4444/ffffff?text=Psychology'
      ELSE 'https://via.placeholder.com/400x600/6B7280/ffffff?text=Course'
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger em courses
DROP TRIGGER IF EXISTS course_image_url_trigger ON public.courses;
CREATE TRIGGER course_image_url_trigger
  BEFORE INSERT OR UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_course_image_url();

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índice para buscas rápidas por bucket
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name ON storage.objects(bucket_id, name);
CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at ON storage.objects(created_at);

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON FUNCTION get_file_info(text, text) IS 'Retorna informações detalhadas de um arquivo no storage';
COMMENT ON FUNCTION cleanup_orphaned_files(text) IS 'Remove arquivos órfãos de um bucket específico';
COMMENT ON FUNCTION update_course_image_url() IS 'Atualiza automaticamente URL de imagem padrão para cursos';

-- Documentar buckets
UPDATE storage.buckets SET 
  public = true,
  avif_autodetection = false,
  file_size_limit = 52428800, -- 50MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf']
WHERE id IN ('uploads', 'course-covers', 'course-videos', 'course-materials');

UPDATE storage.buckets SET 
  public = true,
  avif_autodetection = true,
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'avatars'; 