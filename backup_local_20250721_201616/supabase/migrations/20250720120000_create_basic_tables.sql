-- Criar tabelas básicas para cursos, módulos e aulas
-- Autor: Sistema
-- Data: 2025-07-20

-- ✅ TABLES: Criar tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    duration_hours INTEGER DEFAULT 0,
    difficulty_level TEXT DEFAULT 'beginner',
    instructor_name TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ TABLES: Criar tabela de módulos
CREATE TABLE IF NOT EXISTS course_modules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    estimated_duration INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ TABLES: Criar tabela de aulas
CREATE TABLE IF NOT EXISTS course_lessons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    module_id TEXT REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    content_text TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    document_url TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ INDEXES: Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(order_index);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON course_lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active);

-- ✅ RLS: Habilitar Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- ✅ POLICIES: Criar políticas de acesso
-- Políticas para cursos
DROP POLICY IF EXISTS "Cursos são visíveis para todos" ON courses;
CREATE POLICY "Cursos são visíveis para todos" ON courses
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins podem gerenciar cursos" ON courses;
CREATE POLICY "Admins podem gerenciar cursos" ON courses
    FOR ALL USING (true);

-- Políticas para módulos
DROP POLICY IF EXISTS "Módulos são visíveis para todos" ON course_modules;
CREATE POLICY "Módulos são visíveis para todos" ON course_modules
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins podem gerenciar módulos" ON course_modules;
CREATE POLICY "Admins podem gerenciar módulos" ON course_modules
    FOR ALL USING (true);

-- Políticas para aulas
DROP POLICY IF EXISTS "Aulas são visíveis para todos" ON course_lessons;
CREATE POLICY "Aulas são visíveis para todos" ON course_lessons
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins podem gerenciar aulas" ON course_lessons;
CREATE POLICY "Admins podem gerenciar aulas" ON course_lessons
    FOR ALL USING (true); 