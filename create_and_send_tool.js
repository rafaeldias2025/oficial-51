import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAndSendTool() {
  try {
    console.log('🔄 Criando nova ferramenta como ADMIN...');

    // 1. Criar a ferramenta
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .insert({
        name: 'Avaliação de Inteligência Emocional e Autoconhecimento',
        description: 'Avaliação profunda da sua inteligência emocional e autoconhecimento para desenvolvimento pessoal',
        category: 'inteligencia_emocional',
        total_questions: 10,
        estimated_time: 25,
        question_data: JSON.stringify([
          {
            question: 'Como você reage quando alguém critica seu trabalho?',
            type: 'multiple_choice',
            options: ['Fico defensivo e irritado', 'Escuto com atenção e reflito', 'Ignoro completamente', 'Peço mais detalhes'],
            category: 'Autocontrole'
          },
          {
            question: 'Quando você está estressado, qual é sua primeira reação?',
            type: 'multiple_choice',
            options: ['Procuro isolar-me', 'Falo com alguém de confiança', 'Pratico exercícios', 'Como algo que gosto'],
            category: 'Gestão de Estresse'
          },
          {
            question: 'Em uma situação de conflito, você tende a:',
            type: 'multiple_choice',
            options: ['Evitar o conflito', 'Confrontar diretamente', 'Procurar um meio termo', 'Analisar antes de agir'],
            category: 'Resolução de Conflitos'
          },
          {
            question: 'Como você avalia sua capacidade de empatia?',
            type: 'scale',
            category: 'Empatia'
          },
          {
            question: 'Quando algo dá errado, você:',
            type: 'multiple_choice',
            options: ['Culpa os outros', 'Culpa a si mesmo', 'Analisa o que pode aprender', 'Foca em soluções'],
            category: 'Responsabilidade'
          },
          {
            question: 'Qual é sua maior qualidade emocional?',
            type: 'text',
            category: 'Autoconhecimento'
          },
          {
            question: 'Como você lida com mudanças inesperadas?',
            type: 'scale',
            category: 'Adaptabilidade'
          },
          {
            question: 'Quando você está feliz, você:',
            type: 'multiple_choice',
            options: ['Compartilha com todos', 'Mantém para si', 'Celebra discretamente', 'Foca em outras tarefas'],
            category: 'Expressão Emocional'
          },
          {
            question: 'Qual área da sua inteligência emocional você gostaria de desenvolver mais?',
            type: 'multiple_choice',
            options: ['Autocontrole', 'Empatia', 'Motivação', 'Habilidades sociais', 'Autoconhecimento'],
            category: 'Desenvolvimento'
          },
          {
            question: 'Descreva uma situação onde você usou sua inteligência emocional com sucesso:',
            type: 'text',
            category: 'Experiência'
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

    // 2. Criar uma sessão para o usuário (ENVIAR FERRAMENTA)
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001', // ID do usuário João Silva
        admin_id: '00000000-0000-0000-0000-000000000001', // ID do admin Rafael
        tool_id: tool.id,
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        instructions: 'Complete esta avaliação de inteligência emocional com honestidade. Os resultados serão usados para personalizar seu desenvolvimento pessoal.'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Erro ao enviar ferramenta:', sessionError);
      return;
    }

    console.log('✅ Ferramenta enviada para o usuário:', session.id);

    // 3. Criar notificação para o usuário
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001',
        title: 'Nova Avaliação Disponível',
        message: 'Você recebeu uma nova avaliação de Inteligência Emocional do seu coach. Acesse suas sessões para começar.',
        type: 'session_assigned',
        is_read: false,
        session_id: session.id
      })
      .select()
      .single();

    if (notificationError) {
      console.log('⚠️ Erro ao criar notificação:', notificationError);
    } else {
      console.log('✅ Notificação criada:', notification.id);
    }

    console.log('🎉 FERRAMENTA ENVIADA COM SUCESSO!');
    console.log('📋 Ferramenta ID:', tool.id);
    console.log('📝 Sessão ID:', session.id);
    console.log('👤 Enviada para: João Silva');
    console.log('👨‍💼 Enviada por: Rafael Ferreira Dias (Admin)');
    console.log('🔗 Usuário pode acessar: http://localhost:8082/user-sessions');
    console.log('📊 Admin pode acompanhar: http://localhost:8082/tool-management');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createAndSendTool(); 