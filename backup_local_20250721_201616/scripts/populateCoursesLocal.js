import { createClient } from '@supabase/supabase-js';

// Configuração para Supabase local
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dados dos cursos
const courseData = {
  "courses": [
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZB8",
      "title": "Gestão do Tempo e Produtividade",
      "description": "Otimize sua rotina e aumente sua produtividade com métodos eficazes de gestão do tempo",
      "category": "produtividade",
      "price": 197.00,
      "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      "is_active": true,
      "duration_hours": 8,
      "difficulty_level": "intermediate",
      "instructor_name": "Dr. Carlos Silva",
      "tags": ["produtividade", "gestão", "tempo", "eficiência"],
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    },
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZB9",
      "title": "Pílulas do Bem",
      "description": "Conteúdo motivacional e transformador em doses diárias para uma vida mais equilibrada",
      "category": "pilulas",
      "price": 97.00,
      "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      "is_active": true,
      "duration_hours": 4,
      "difficulty_level": "beginner",
      "instructor_name": "Dra. Ana Wellness",
      "tags": ["motivação", "bem-estar", "transformação", "autoajuda"],
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    }
  ]
};

// Dados dos módulos
const moduleData = {
  "modules": [
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZC0",
      "course_id": "01JCEHN6MZP3RQWJ5YH4V7XZB8",
      "title": "Fundamentos da Gestão do Tempo",
      "description": "Conceitos básicos e metodologias essenciais",
      "order_index": 1,
      "is_active": true,
      "estimated_duration": 120,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    },
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZC1",
      "course_id": "01JCEHN6MZP3RQWJ5YH4V7XZB8",
      "title": "Técnicas Avançadas de Produtividade",
      "description": "Métodos práticos para maximizar a eficiência",
      "order_index": 2,
      "is_active": true,
      "estimated_duration": 180,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    },
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZC2",
      "course_id": "01JCEHN6MZP3RQWJ5YH4V7XZB9",
      "title": "Transformação Diária",
      "description": "Práticas para uma vida mais equilibrada",
      "order_index": 1,
      "is_active": true,
      "estimated_duration": 90,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    }
  ]
};

// Dados das aulas
const lessonData = {
  "lessons": [
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZD0",
      "module_id": "01JCEHN6MZP3RQWJ5YH4V7XZC0",
      "title": "Introdução à Gestão do Tempo",
      "description": "Conceitos fundamentais sobre gestão eficaz do tempo",
      "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "content_text": "Nesta aula você aprenderá os conceitos básicos de gestão do tempo...",
      "duration_minutes": 30,
      "order_index": 1,
      "is_active": true,
      "document_url": null,
      "image_url": null,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    },
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZD1",
      "module_id": "01JCEHN6MZP3RQWJ5YH4V7XZC0",
      "title": "Matriz de Eisenhower",
      "description": "Aprenda a priorizar tarefas usando a matriz de Eisenhower",
      "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "content_text": "A matriz de Eisenhower é uma ferramenta poderosa...",
      "duration_minutes": 45,
      "order_index": 2,
      "is_active": true,
      "document_url": null,
      "image_url": null,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    },
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZD2",
      "module_id": "01JCEHN6MZP3RQWJ5YH4V7XZC1",
      "title": "Técnica Pomodoro",
      "description": "Maximize sua concentração com a técnica Pomodoro",
      "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "content_text": "A técnica Pomodoro revoluciona a forma de trabalhar...",
      "duration_minutes": 40,
      "order_index": 1,
      "is_active": true,
      "document_url": null,
      "image_url": null,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    },
    {
      "id": "01JCEHN6MZP3RQWJ5YH4V7XZD3",
      "module_id": "01JCEHN6MZP3RQWJ5YH4V7XZC2",
      "title": "Mindfulness Matinal",
      "description": "Comece o dia com práticas de mindfulness",
      "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "content_text": "Práticas de mindfulness para um início de dia equilibrado...",
      "duration_minutes": 20,
      "order_index": 1,
      "is_active": true,
      "document_url": null,
      "image_url": null,
      "created_at": "2025-01-17T12:00:00Z",
      "updated_at": "2025-01-17T12:00:00Z"
    }
  ]
};

async function populateDatabase() {
  try {
    console.log('🚀 Iniciando população do banco de dados...');
    
    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await supabase.from('course_lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('course_modules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Inserir cursos
    console.log('📚 Inserindo cursos...');
    const { error: coursesError } = await supabase
      .from('courses')
      .insert(courseData.courses);
    
    if (coursesError) throw coursesError;
    console.log('✅ Cursos inseridos com sucesso!');
    
    // Inserir módulos
    console.log('📂 Inserindo módulos...');
    const { error: modulesError } = await supabase
      .from('course_modules')
      .insert(moduleData.modules);
    
    if (modulesError) throw modulesError;
    console.log('✅ Módulos inseridos com sucesso!');
    
    // Inserir aulas
    console.log('🎬 Inserindo aulas...');
    const { error: lessonsError } = await supabase
      .from('course_lessons')
      .insert(lessonData.lessons);
    
    if (lessonsError) throw lessonsError;
    console.log('✅ Aulas inseridas com sucesso!');
    
    console.log('🎉 População do banco de dados concluída com sucesso!');
    
    // Verificar os dados inseridos
    console.log('\n📊 Verificando dados inseridos:');
    const { data: courses } = await supabase.from('courses').select('id, title');
    console.log('Cursos:', courses);
    
    const { data: modules } = await supabase.from('course_modules').select('id, title, course_id');
    console.log('Módulos:', modules);
    
    const { data: lessons } = await supabase.from('course_lessons').select('id, title, module_id');
    console.log('Aulas:', lessons);
    
  } catch (error) {
    console.error('❌ Erro ao popular o banco:', {
      message: error.message,
      details: error.details || error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });
  }
}

// Executar a população
populateDatabase(); 