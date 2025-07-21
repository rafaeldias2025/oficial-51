-- Criar perfil para o usuário admin existente
INSERT INTO public.profiles (user_id, email, full_name, role)
VALUES ('d4c7e35c-2f66-4e5d-8d09-c0ba8d0d7187', 'admin@instituto.com', 'Admin Instituto', 'admin')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Corrigir política RLS para permitir que admins criem perfis
CREATE POLICY "Admins can insert profiles" ON public.profiles
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
  OR auth.uid() = user_id
);

-- Política para permitir que trigger crie perfis automaticamente
CREATE POLICY "System can create profiles" ON public.profiles
FOR INSERT 
WITH CHECK (true);

-- Corrigir políticas de storage para permitir uploads por admins
CREATE POLICY "Admins can upload to course-images" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'course-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can view course-images" ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'course-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Public can view course-images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'course-images');