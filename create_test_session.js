import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestSession() {
  try {
    console.log('🔄 Criando sessão de teste...');

    // 1. Criar uma sessão para o usuário
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001', // ID válido da tabela profiles
        admin_id: '00000000-0000-0000-0000-000000000001', // Mesmo ID para admin
        tool_id: 2, // ID da ferramenta que criamos
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        instructions: 'Complete a avaliação de sabotadores do emagrecimento com honestidade.'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Erro ao criar sessão:', sessionError);
      return;
    }

    console.log('✅ Sessão criada:', session.id);

    // 2. Criar algumas respostas de exemplo
    const responses = [
      {
        session_id: session.id,
        question_number: 1,
        question_text: 'Com que frequência você come por impulso emocional?',
        response_value: '7',
        response_text: 'Frequentemente',
        category: 'Emocional'
      },
      {
        session_id: session.id,
        question_number: 2,
        question_text: 'Como você avalia sua disciplina alimentar?',
        response_value: '6',
        response_text: 'Boa',
        category: 'Disciplina'
      },
      {
        session_id: session.id,
        question_number: 3,
        question_text: 'Qual é seu maior sabotador alimentar?',
        response_value: 'Estresse',
        response_text: 'Estresse',
        category: 'Identificação'
      },
      {
        session_id: session.id,
        question_number: 4,
        question_text: 'Descreva uma situação onde você sabotou sua dieta:',
        response_value: 'Comi chocolate quando estava estressada',
        response_text: 'Comi chocolate quando estava estressada',
        category: 'Reflexão'
      },
      {
        session_id: session.id,
        question_number: 5,
        question_text: 'Como você se sente após comer algo que não deveria?',
        response_value: '8',
        response_text: 'Culpada',
        category: 'Emocional'
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

    // 3. Criar resultado da sessão
    const { data: result, error: resultError } = await supabase
      .from('session_results')
      .insert({
        session_id: session.id,
        total_score: 7.2,
        overall_score: 72,
        category_scores: {
          'Emocional': 7.5,
          'Disciplina': 6.0,
          'Identificação': 8.0,
          'Reflexão': 7.0
        },
        insights: [
          'Você demonstra boa consciência dos seus sabotadores',
          'O estresse é seu principal gatilho alimentar',
          'Há espaço para melhorar a disciplina alimentar'
        ],
        recommendations: [
          'Desenvolva estratégias para lidar com o estresse',
          'Crie um plano alimentar mais estruturado',
          'Pratique mindfulness antes das refeições'
        ],
        summary: 'Avaliação positiva com identificação clara dos sabotadores principais.',
        radar_data: [
          { category: 'Mental', value: 8, color: '#3b82f6' },
          { category: 'Emocional', value: 7, color: '#10b981' },
          { category: 'Relacionamentos', value: 6, color: '#8b5cf6' },
          { category: 'Objetivos', value: 9, color: '#f59e0b' },
          { category: 'Físico', value: 8, color: '#ef4444' },
          { category: 'Espiritual', value: 7, color: '#06b6d4' }
        ],
        bar_chart_data: [
          { category: 'Mental', value: 8, color: '#3b82f6', percentage: 80 },
          { category: 'Emocional', value: 7, color: '#10b981', percentage: 70 },
          { category: 'Relacionamentos', value: 6, color: '#8b5cf6', percentage: 60 },
          { category: 'Objetivos', value: 9, color: '#f59e0b', percentage: 90 },
          { category: 'Físico', value: 8, color: '#ef4444', percentage: 80 },
          { category: 'Espiritual', value: 7, color: '#06b6d4', percentage: 70 }
        ],
        gauge_value: 72
      })
      .select()
      .single();

    if (resultError) {
      console.error('❌ Erro ao criar resultado:', resultError);
      return;
    }

    console.log('✅ Resultado criado:', result.id);

    console.log('🎉 Teste completo criado com sucesso!');
    console.log('📋 Ferramenta ID: 2');
    console.log('📝 Sessão ID:', session.id);
    console.log('📊 Resultado ID:', result.id);
    console.log('🔗 Acesse: http://localhost:8082/user-sessions');
    console.log('📈 Resultados: http://localhost:8082/session-results');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createTestSession(); 