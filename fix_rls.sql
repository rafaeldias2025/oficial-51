-- Desabilitar RLS temporariamente para resolver problemas de login
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_ratings DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_hero_config DISABLE ROW LEVEL SECURITY;

-- Inserir perfil admin se não existir
INSERT INTO profiles (id, user_id, email, full_name)
VALUES (
  '69162bc4-003e-40aa-9483-02e3b529b513',
  '69162bc4-003e-40aa-9483-02e3b529b513',
  'admin@instituto.com',
  'Administrador'
) ON CONFLICT (id) DO NOTHING; 