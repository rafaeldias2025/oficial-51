import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestTool() {
  try {
    console.log('🔄 Criando ferramenta de teste...');

    // 1. Criar a ferramenta
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .insert({
        name: 'Teste de Sabotadores do Emagrecimento',
        description: 'Avaliação completa dos sabotadores que impedem o emagrecimento',
        category: 'saude',
        total_questions: 5,
        estimated_time: 15,
        question_data: JSON.stringify([
          {
            question: 'Com que frequência você come por impulso emocional?',
            type: 'slider',
            category: 'Emocional'
          },
          {
            question: 'Como você avalia sua disciplina alimentar?',
            type: 'scale',
            category: 'Disciplina'
          },
          {
            question: 'Qual é seu maior sabotador alimentar?',
            type: 'multiple_choice',
            options: ['Estresse', 'Tédio', 'Social', 'Fome emocional', 'Falta de planejamento'],
            category: 'Identificação'
          },
          {
            question: 'Descreva uma situação onde você sabotou sua dieta:',
            type: 'text',
            category: 'Reflexão'
          },
          {
            question: 'Como você se sente após comer algo que não deveria?',
            type: 'scale',
            category: 'Emocional'
          }
        ]),
        scoring_config: JSON.stringify({
          max_score: 10,
          passing_score: 7
        }),
        is_active: true
      })
      .select()
      .single();

    if (toolError) {
      console.error('❌ Erro ao criar ferramenta:', toolError);
      return;
    }

    console.log('✅ Ferramenta criada:', tool.id);

    // 2. Criar uma sessão para o usuário
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: 1, // Usuário de teste
        tool_id: tool.id,
        status: 'scheduled',
        scheduled_date: new Date().toISOString(),
        estimated_duration: 15,
        instructions: 'Complete a avaliação de sabotadores do emagrecimento.'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Erro ao criar sessão:', sessionError);
      return;
    }

    console.log('✅ Sessão criada:', session.id);

    console.log('🎉 Teste completo criado com sucesso!');
    console.log('📋 Ferramenta ID:', tool.id);
    console.log('📝 Sessão ID:', session.id);
    console.log('🔗 Acesse: http://localhost:8082/user-sessions');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createTestTool(); 