import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createNewTool() {
  try {
    console.log('🔄 Criando nova ferramenta de teste...');

    // 1. Criar a ferramenta
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .insert({
        name: 'Avaliação de Bem-Estar e Qualidade de Vida',
        description: 'Avaliação completa do seu bem-estar físico, mental e emocional',
        category: 'bem_estar',
        total_questions: 8,
        estimated_time: 20,
        question_data: JSON.stringify([
          {
            question: 'Como você avalia seu nível de energia geral?',
            type: 'scale',
            category: 'Energia'
          },
          {
            question: 'Com que frequência você pratica exercícios físicos?',
            type: 'slider',
            category: 'Atividade Física'
          },
          {
            question: 'Qual é sua principal fonte de estresse?',
            type: 'multiple_choice',
            options: ['Trabalho', 'Relacionamentos', 'Finanças', 'Saúde', 'Falta de tempo'],
            category: 'Estresse'
          },
          {
            question: 'Como você avalia a qualidade do seu sono?',
            type: 'scale',
            category: 'Sono'
          },
          {
            question: 'Descreva uma situação que te deixou muito feliz recentemente:',
            type: 'text',
            category: 'Bem-Estar'
          },
          {
            question: 'Com que frequência você se sente ansioso ou preocupado?',
            type: 'slider',
            category: 'Saúde Mental'
          },
          {
            question: 'Como você avalia sua alimentação?',
            type: 'scale',
            category: 'Nutrição'
          },
          {
            question: 'Qual área da sua vida você gostaria de melhorar mais?',
            type: 'multiple_choice',
            options: ['Saúde física', 'Saúde mental', 'Relacionamentos', 'Carreira', 'Finanças', 'Lazer'],
            category: 'Objetivos'
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

    console.log('✅ Nova ferramenta criada:', tool.id);

    // 2. Criar uma sessão para o usuário
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001', // ID válido da tabela profiles
        admin_id: '00000000-0000-0000-0000-000000000001', // Mesmo ID para admin
        tool_id: tool.id,
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        instructions: 'Complete a avaliação de bem-estar com honestidade para obter insights personalizados.'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Erro ao criar sessão:', sessionError);
      return;
    }

    console.log('✅ Nova sessão criada:', session.id);

    console.log('🎉 Nova ferramenta criada com sucesso!');
    console.log('📋 Ferramenta ID:', tool.id);
    console.log('📝 Sessão ID:', session.id);
    console.log('🔗 Acesse: http://localhost:8082/user-sessions');
    console.log('📋 Admin: http://localhost:8082/tool-management');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createNewTool(); 