-- Adicionar campo de imagem para módulos
ALTER TABLE public.course_modules 
ADD COLUMN image_url text;