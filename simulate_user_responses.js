import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateUserResponses() {
  try {
    console.log('🔄 Simulando respostas do usuário...');

    const sessionId = 19; // ID da sessão que acabamos de criar

    // 1. Criar respostas para todas as 8 perguntas
    const responses = [
      {
        session_id: sessionId,
        question_number: 1,
        question_text: 'Como você avalia seu nível de energia geral?',
        response_value: '8',
        response_text: 'Alto',
        category: 'Energia'
      },
      {
        session_id: sessionId,
        question_number: 2,
        question_text: 'Com que frequência você pratica exercícios físicos?',
        response_value: '6',
        response_text: '3-4 vezes por semana',
        category: 'Atividade Física'
      },
      {
        session_id: sessionId,
        question_number: 3,
        question_text: 'Qual é sua principal fonte de estresse?',
        response_value: 'Trabalho',
        response_text: 'Trabalho',
        category: 'Estresse'
      },
      {
        session_id: sessionId,
        question_number: 4,
        question_text: 'Como você avalia a qualidade do seu sono?',
        response_value: '7',
        response_text: 'Boa',
        category: 'Sono'
      },
      {
        session_id: sessionId,
        question_number: 5,
        question_text: 'Descreva uma situação que te deixou muito feliz recentemente:',
        response_value: 'Conseguir uma promoção no trabalho e celebrar com a família',
        response_text: 'Conseguir uma promoção no trabalho e celebrar com a família',
        category: 'Bem-Estar'
      },
      {
        session_id: sessionId,
        question_number: 6,
        question_text: 'Com que frequência você se sente ansioso ou preocupado?',
        response_value: '5',
        response_text: 'Ocasionalmente',
        category: 'Saúde Mental'
      },
      {
        session_id: sessionId,
        question_number: 7,
        question_text: 'Como você avalia sua alimentação?',
        response_value: '8',
        response_text: 'Muito boa',
        category: 'Nutrição'
      },
      {
        session_id: sessionId,
        question_number: 8,
        question_text: 'Qual área da sua vida você gostaria de melhorar mais?',
        response_value: 'Saúde mental',
        response_text: 'Saúde mental',
        category: 'Objetivos'
      }
    ];

    const { data: responsesData, error: responsesError } = await supabase
      .from('session_responses')
      .insert(responses)
      .select();

    if (responsesError) {
      console.error('❌ Erro ao criar respostas:', responsesError);
      return;
    }

    console.log('✅ Respostas criadas:', responsesData.length);

    // 2. Criar resultado da sessão com análise completa
    const { data: result, error: resultError } = await supabase
      .from('session_results')
      .insert({
        session_id: sessionId,
        total_score: 8.1,
        overall_score: 81,
        category_scores: {
          'Energia': 8.0,
          'Atividade Física': 6.0,
          'Estresse': 7.0,
          'Sono': 7.0,
          'Bem-Estar': 9.0,
          'Saúde Mental': 5.0,
          'Nutrição': 8.0,
          'Objetivos': 8.0
        },
        insights: [
          'Você demonstra excelente nível de energia e bem-estar geral',
          'Sua alimentação e sono estão em ótimo nível',
          'O trabalho é sua principal fonte de estresse',
          'Há oportunidade de melhorar a saúde mental e reduzir ansiedade',
          'Você tem clareza sobre suas prioridades de melhoria'
        ],
        recommendations: [
          'Implemente técnicas de mindfulness para reduzir o estresse do trabalho',
          'Mantenha a consistência nos exercícios físicos (3-4x/semana)',
          'Considere terapia ou coaching para melhorar a saúde mental',
          'Continue com a alimentação balanceada e sono de qualidade',
          'Celebre suas conquistas como a promoção no trabalho'
        ],
        summary: 'Excelente avaliação de bem-estar com pontuação alta (81%). Você demonstra equilíbrio entre diferentes áreas da vida, com destaque para energia, alimentação e sono. A principal área de melhoria é a saúde mental.',
        radar_data: [
          { category: 'Energia', value: 8, color: '#3b82f6' },
          { category: 'Atividade Física', value: 6, color: '#10b981' },
          { category: 'Estresse', value: 7, color: '#8b5cf6' },
          { category: 'Sono', value: 7, color: '#f59e0b' },
          { category: 'Bem-Estar', value: 9, color: '#ef4444' },
          { category: 'Saúde Mental', value: 5, color: '#06b6d4' },
          { category: 'Nutrição', value: 8, color: '#84cc16' },
          { category: 'Objetivos', value: 8, color: '#f97316' }
        ],
        bar_chart_data: [
          { category: 'Energia', value: 8, color: '#3b82f6', percentage: 80 },
          { category: 'Atividade Física', value: 6, color: '#10b981', percentage: 60 },
          { category: 'Estresse', value: 7, color: '#8b5cf6', percentage: 70 },
          { category: 'Sono', value: 7, color: '#f59e0b', percentage: 70 },
          { category: 'Bem-Estar', value: 9, color: '#ef4444', percentage: 90 },
          { category: 'Saúde Mental', value: 5, color: '#06b6d4', percentage: 50 },
          { category: 'Nutrição', value: 8, color: '#84cc16', percentage: 80 },
          { category: 'Objetivos', value: 8, color: '#f97316', percentage: 80 }
        ],
        gauge_value: 81
      })
      .select()
      .single();

    if (resultError) {
      console.error('❌ Erro ao criar resultado:', resultError);
      return;
    }

    console.log('✅ Resultado criado:', result.id);

    console.log('🎉 Simulação completa com sucesso!');
    console.log('📝 Sessão ID:', sessionId);
    console.log('📊 Resultado ID:', result.id);
    console.log('📈 Pontuação Geral: 81%');
    console.log('🔗 Acesse: http://localhost:8082/user-sessions');
    console.log('📈 Resultados: http://localhost:8082/session-results');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

simulateUserResponses(); 