-- Adicionar campos de arquivo às aulas
ALTER TABLE course_lessons 
ADD COLUMN document_url TEXT,
ADD COLUMN image_url TEXT; 