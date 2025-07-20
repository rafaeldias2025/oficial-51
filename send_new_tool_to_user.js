import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendNewToolToUser() {
  try {
    console.log('🔄 Criando nova ferramenta e enviando para usuário...');

    // 1. Criar nova ferramenta
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .insert({
        name: 'Avaliação de Produtividade e Foco',
        description: 'Avaliação completa da sua produtividade, foco e hábitos de trabalho',
        category: 'produtividade',
        total_questions: 12,
        estimated_time: 30,
        question_data: JSON.stringify([
          {
            question: 'Como você organiza suas tarefas diárias?',
            type: 'multiple_choice',
            options: ['Lista mental', 'Aplicativo de tarefas', 'Papel e caneta', 'Não organizo'],
            category: 'Organização'
          },
          {
            question: 'Qual é sua maior distração no trabalho?',
            type: 'multiple_choice',
            options: ['Redes sociais', 'E-mails', 'Conversas', 'Telefone', 'Outros'],
            category: 'Foco'
          },
          {
            question: 'Quantas horas você consegue manter foco contínuo?',
            type: 'scale',
            category: 'Concentração'
          },
          {
            question: 'Como você lida com interrupções durante o trabalho?',
            type: 'multiple_choice',
            options: ['Paro tudo e atendo', 'Agendo para depois', 'Ignoro completamente', 'Respondo rapidamente'],
            category: 'Gestão de Interrupções'
          },
          {
            question: 'Qual técnica de produtividade você usa mais?',
            type: 'multiple_choice',
            options: ['Pomodoro', 'Time blocking', 'Getting Things Done', 'Nenhuma', 'Outras'],
            category: 'Técnicas'
          },
          {
            question: 'Como você avalia sua capacidade de priorizar tarefas?',
            type: 'scale',
            category: 'Priorização'
          },
          {
            question: 'Qual é seu ambiente de trabalho ideal?',
            type: 'text',
            category: 'Ambiente'
          },
          {
            question: 'Com que frequência você faz pausas durante o trabalho?',
            type: 'slider',
            category: 'Pausas'
          },
          {
            question: 'Como você mede sua produtividade?',
            type: 'multiple_choice',
            options: ['Tarefas concluídas', 'Tempo trabalhado', 'Resultados alcançados', 'Não meço'],
            category: 'Métricas'
          },
          {
            question: 'Qual área da produtividade você quer melhorar mais?',
            type: 'multiple_choice',
            options: ['Foco', 'Organização', 'Gestão de tempo', 'Motivação', 'Técnicas'],
            category: 'Objetivos'
          },
          {
            question: 'Descreva um dia onde você foi muito produtivo:',
            type: 'text',
            category: 'Experiência'
          },
          {
            question: 'Qual é seu maior desafio para manter a produtividade?',
            type: 'text',
            category: 'Desafios'
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

    // 2. Enviar ferramenta para o usuário João Silva
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001', // João Silva
        admin_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // Super Admin
        tool_id: tool.id,
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        instructions: 'Complete esta avaliação de produtividade com honestidade. Os resultados ajudarão a identificar áreas de melhoria no seu trabalho.'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Erro ao enviar sessão:', sessionError);
      return;
    }

    console.log('✅ Sessão enviada para o usuário:', session.id);

    // 3. Criar notificação para o usuário
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001',
        title: 'Nova Avaliação de Produtividade',
        message: 'Você recebeu uma nova avaliação de Produtividade e Foco do seu coach. Acesse suas sessões para começar.',
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
    console.log('📋 Ferramenta: Avaliação de Produtividade e Foco');
    console.log('📝 Sessão ID:', session.id);
    console.log('👤 Enviada para: João Silva');
    console.log('👨‍💼 Enviada por: Super Administrador');
    console.log('🔗 Usuário pode acessar: http://localhost:8082/user-sessions');
    console.log('📊 Admin pode acompanhar: http://localhost:8082/tool-management');

    console.log('\n📋 DETALHES DA FERRAMENTA:');
    console.log('📝 Nome: Avaliação de Produtividade e Foco');
    console.log('⏱️ Tempo: 30 minutos');
    console.log('❓ Perguntas: 12');
    console.log('📊 Categoria: Produtividade');
    console.log('🎯 Objetivo: Melhorar foco e produtividade');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

sendNewToolToUser(); 