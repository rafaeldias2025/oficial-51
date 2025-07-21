-- Inserir cursos de exemplo
INSERT INTO public.courses (id, title, description, image_url, category, price, is_active, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Transformação Completa 2025', 'Programa completo de transformação pessoal com foco em saúde, bem-estar e desenvolvimento pessoal', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'transformação', 297.00, true, now(), now()),
(gen_random_uuid(), 'Pílulas do Bem', 'Conteúdo motivacional e transformador em doses diárias para uma vida mais equilibrada', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'pilulas', 97.00, true, now(), now()),
(gen_random_uuid(), 'Comunidade dos Sonhos', 'Conteúdo exclusivo da comunidade para realização de sonhos e metas', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'comunidade', 197.00, true, now(), now()),
(gen_random_uuid(), 'Plataforma dos Sonhos', 'Cursos completos para transformação pessoal através de metodologias comprovadas', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'plataforma', 497.00, true, now(), now()),
(gen_random_uuid(), 'Método de Emagrecimento Saudável', 'Aprenda a emagrecer de forma saudável e sustentável com acompanhamento especializado', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'saude', 397.00, true, now(), now()),
(gen_random_uuid(), 'Mindfulness e Meditação', 'Desenvolva sua prática de mindfulness e meditação para uma vida mais presente e equilibrada', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'mindfulness', 197.00, true, now(), now()),
(gen_random_uuid(), 'Nutrição Inteligente', 'Aprenda os fundamentos da nutrição para uma alimentação consciente e saudável', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'nutricao', 297.00, true, now(), now()),
(gen_random_uuid(), 'Fitness e Bem-Estar', 'Programa completo de exercícios e atividades físicas adaptadas para seu estilo de vida', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'fitness', 197.00, true, now(), now()),
(gen_random_uuid(), 'Psicologia Positiva', 'Desenvolva uma mentalidade positiva e resiliente através de técnicas comprovadas', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'psicologia', 197.00, true, now(), now()),
(gen_random_uuid(), 'Gestão do Tempo e Produtividade', 'Otimize sua rotina e aumente sua produtividade com métodos eficazes de gestão do tempo', '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 'produtividade', 197.00, true, now(), now());

-- Inserir módulos para cada curso
DO $$
DECLARE
    course_record RECORD;
    module_id_1 UUID;
    module_id_2 UUID;
    module_id_3 UUID;
BEGIN
    -- Para cada curso, criar 3 módulos
    FOR course_record IN SELECT id, title FROM public.courses WHERE is_active = true
    LOOP
        -- Módulo 1: Fundamentos
        INSERT INTO public.course_modules (id, course_id, title, description, image_url, order_index, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), course_record.id, 'Módulo 1: Fundamentos', 'Conceitos básicos e introdução ao ' || course_record.title, '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 1, true, now(), now())
        RETURNING id INTO module_id_1;
        
        -- Módulo 2: Prática
        INSERT INTO public.course_modules (id, course_id, title, description, image_url, order_index, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), course_record.id, 'Módulo 2: Prática', 'Aplicação prática dos conceitos do ' || course_record.title, '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 2, true, now(), now())
        RETURNING id INTO module_id_2;
        
        -- Módulo 3: Avançado
        INSERT INTO public.course_modules (id, course_id, title, description, image_url, order_index, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), course_record.id, 'Módulo 3: Avançado', 'Técnicas avançadas e aprofundamento do ' || course_record.title, '/lovable-uploads/e11a2f11-702a-4edb-8b19-132d18bea926.png', 3, true, now(), now())
        RETURNING id INTO module_id_3;
        
        -- Inserir aulas para cada módulo
        -- Aulas do Módulo 1
        INSERT INTO public.course_lessons (module_id, title, description, video_url, duration_minutes, order_index, is_active, created_at, updated_at) VALUES
        (module_id_1, 'Aula 1: Introdução', 'Apresentação do curso e objetivos principais', 'https://www.youtube.com/watch?v=example1', 15, 1, true, now(), now()),
        (module_id_1, 'Aula 2: Conceitos Básicos', 'Fundamentos teóricos essenciais', 'https://www.youtube.com/watch?v=example2', 25, 2, true, now(), now()),
        (module_id_1, 'Aula 3: Primeiros Passos', 'Como começar sua jornada de transformação', 'https://www.youtube.com/watch?v=example3', 20, 3, true, now(), now());
        
        -- Aulas do Módulo 2
        INSERT INTO public.course_lessons (module_id, title, description, video_url, duration_minutes, order_index, is_active, created_at, updated_at) VALUES
        (module_id_2, 'Aula 4: Prática Básica', 'Exercícios práticos fundamentais', 'https://www.youtube.com/watch?v=example4', 30, 1, true, now(), now()),
        (module_id_2, 'Aula 5: Aplicação Real', 'Como aplicar no dia a dia', 'https://www.youtube.com/watch?v=example5', 35, 2, true, now(), now()),
        (module_id_2, 'Aula 6: Estudos de Caso', 'Exemplos práticos e casos de sucesso', 'https://www.youtube.com/watch?v=example6', 40, 3, true, now(), now());
        
        -- Aulas do Módulo 3
        INSERT INTO public.course_lessons (module_id, title, description, video_url, duration_minutes, order_index, is_active, created_at, updated_at) VALUES
        (module_id_3, 'Aula 7: Técnicas Avançadas', 'Métodos avançados para resultados superiores', 'https://www.youtube.com/watch?v=example7', 45, 1, true, now(), now()),
        (module_id_3, 'Aula 8: Personalização', 'Como adaptar para suas necessidades específicas', 'https://www.youtube.com/watch?v=example8', 50, 2, true, now(), now()),
        (module_id_3, 'Aula 9: Manutenção e Continuidade', 'Como manter os resultados a longo prazo', 'https://www.youtube.com/watch?v=example9', 35, 3, true, now(), now());
        
    END LOOP;
END $$;