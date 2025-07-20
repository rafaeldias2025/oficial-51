import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function criarAvaliacoesCompletas() {
  try {
    console.log('🔄 Criando avaliações completas com muitas perguntas...');
    
    // 1. Inserir avaliações dos sistemas anteriores
    const avaliacoesCompletas = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        tool_id: 10, // Avaliação de Metas e Objetivos
        status: 'completed',
        scheduled_date: new Date('2025-01-15').toISOString(),
        started_at: new Date('2025-01-15T10:00:00').toISOString(),
        completed_at: new Date('2025-01-15T10:45:00').toISOString(),
        instructions: 'Avaliação completa do SistemaTizeCoach - 25 perguntas sobre metas pessoais e profissionais',
        created_at: new Date('2025-01-15').toISOString()
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        tool_id: 11, // Avaliação de Bem-estar Emocional
        status: 'completed',
        scheduled_date: new Date('2025-01-20').toISOString(),
        started_at: new Date('2025-01-20T14:00:00').toISOString(),
        completed_at: new Date('2025-01-20T14:35:00').toISOString(),
        instructions: 'Avaliação completa do SistemaGB - 30 perguntas sobre saúde mental e equilíbrio emocional',
        created_at: new Date('2025-01-20').toISOString()
      },
      {
        user_id: '33333333-3333-3333-3333-333333333333',
        tool_id: 12, // Avaliação de Produtividade
        status: 'completed',
        scheduled_date: new Date('2025-02-01').toISOString(),
        started_at: new Date('2025-02-01T09:00:00').toISOString(),
        completed_at: new Date('2025-02-01T09:50:00').toISOString(),
        instructions: 'Avaliação completa do SistemaTizeCoach - 35 perguntas sobre hábitos e rotinas',
        created_at: new Date('2025-02-01').toISOString()
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        tool_id: 13, // Avaliação de Relacionamentos
        status: 'completed',
        scheduled_date: new Date('2025-02-10').toISOString(),
        started_at: new Date('2025-02-10T16:00:00').toISOString(),
        completed_at: new Date('2025-02-10T16:25:00').toISOString(),
        instructions: 'Avaliação completa do SistemaGB - 20 perguntas sobre relacionamentos pessoais e profissionais',
        created_at: new Date('2025-02-10').toISOString()
      },
      {
        user_id: '55555555-5555-5555-5555-555555555555',
        tool_id: 10, // Avaliação de Metas e Objetivos
        status: 'completed',
        scheduled_date: new Date('2025-02-15').toISOString(),
        started_at: new Date('2025-02-15T16:00:00').toISOString(),
        completed_at: new Date('2025-02-15T16:40:00').toISOString(),
        instructions: 'Avaliação completa do SistemaTizeCoach - 28 perguntas sobre reavaliação de metas trimestrais',
        created_at: new Date('2025-02-15').toISOString()
      }
    ];

    console.log('📊 Inserindo avaliações completas...');
    for (const avaliacao of avaliacoesCompletas) {
      const { data, error } = await supabase
        .from('assessment_assignments')
        .upsert(avaliacao, { onConflict: 'id' });
        
      if (error) {
        console.error(`❌ Erro ao inserir avaliação:`, error);
      } else {
        console.log(`✅ Avaliação completa inserida para ${avaliacao.user_id}`);
      }
    }

    // 2. Inserir muitas respostas para cada avaliação
    const respostasCompletas = [
      // Avaliação 1 - SistemaTizeCoach (25 perguntas)
      { session_id: 1, question_number: 1, question_text: 'Qual é sua meta principal para este ano?', response_value: 9, response_text: 'Aumentar produtividade em 50%', category: 'metas' },
      { session_id: 1, question_number: 2, question_text: 'Como você define sucesso pessoal?', response_value: 8, response_text: 'Equilíbrio entre trabalho e vida pessoal', category: 'metas' },
      { session_id: 1, question_number: 3, question_text: 'Qual é sua meta financeira?', response_value: 7, response_text: 'Economizar 30% da renda', category: 'metas' },
      { session_id: 1, question_number: 4, question_text: 'Como você mede seu progresso?', response_value: 9, response_text: 'Métricas específicas e feedback', category: 'metas' },
      { session_id: 1, question_number: 5, question_text: 'Qual é sua meta de saúde?', response_value: 8, response_text: 'Exercitar-se 4x por semana', category: 'metas' },
      { session_id: 1, question_number: 6, question_text: 'Como você planeja suas metas?', response_value: 9, response_text: 'Planejamento detalhado e revisão mensal', category: 'metas' },
      { session_id: 1, question_number: 7, question_text: 'Qual é sua meta profissional?', response_value: 8, response_text: 'Promoção até o final do ano', category: 'metas' },
      { session_id: 1, question_number: 8, question_text: 'Como você lida com obstáculos?', response_value: 7, response_text: 'Análise e busca de alternativas', category: 'metas' },
      { session_id: 1, question_number: 9, question_text: 'Qual é sua meta de aprendizado?', response_value: 9, response_text: 'Cursar especialização', category: 'metas' },
      { session_id: 1, question_number: 10, question_text: 'Como você prioriza suas metas?', response_value: 8, response_text: 'Matriz de priorização', category: 'metas' },
      { session_id: 1, question_number: 11, question_text: 'Qual é sua meta de relacionamento?', response_value: 7, response_text: 'Melhorar comunicação familiar', category: 'metas' },
      { session_id: 1, question_number: 12, question_text: 'Como você celebra conquistas?', response_value: 8, response_text: 'Reconhecimento e recompensas', category: 'metas' },
      { session_id: 1, question_number: 13, question_text: 'Qual é sua meta de tempo livre?', response_value: 6, response_text: 'Dedicar 2h por dia', category: 'metas' },
      { session_id: 1, question_number: 14, question_text: 'Como você revisa suas metas?', response_value: 9, response_text: 'Revisão semanal e ajustes', category: 'metas' },
      { session_id: 1, question_number: 15, question_text: 'Qual é sua meta de networking?', response_value: 7, response_text: 'Participar de 3 eventos por mês', category: 'metas' },
      { session_id: 1, question_number: 16, question_text: 'Como você mantém foco?', response_value: 8, response_text: 'Técnicas de concentração', category: 'metas' },
      { session_id: 1, question_number: 17, question_text: 'Qual é sua meta de desenvolvimento pessoal?', response_value: 9, response_text: 'Ler 2 livros por mês', category: 'metas' },
      { session_id: 1, question_number: 18, question_text: 'Como você gerencia seu tempo?', response_value: 8, response_text: 'Método Pomodoro', category: 'metas' },
      { session_id: 1, question_number: 19, question_text: 'Qual é sua meta de contribuição social?', response_value: 6, response_text: 'Voluntariado mensal', category: 'metas' },
      { session_id: 1, question_number: 20, question_text: 'Como você lida com mudanças?', response_value: 7, response_text: 'Adaptação e flexibilidade', category: 'metas' },
      { session_id: 1, question_number: 21, question_text: 'Qual é sua meta de inovação?', response_value: 8, response_text: 'Desenvolver 2 projetos novos', category: 'metas' },
      { session_id: 1, question_number: 22, question_text: 'Como você busca feedback?', response_value: 9, response_text: 'Solicitação ativa e regular', category: 'metas' },
      { session_id: 1, question_number: 23, question_text: 'Qual é sua meta de liderança?', response_value: 7, response_text: 'Liderar equipe de 5 pessoas', category: 'metas' },
      { session_id: 1, question_number: 24, question_text: 'Como você desenvolve habilidades?', response_value: 8, response_text: 'Prática deliberada e cursos', category: 'metas' },
      { session_id: 1, question_number: 25, question_text: 'Qual é sua meta de impacto?', response_value: 9, response_text: 'Influenciar 100 pessoas positivamente', category: 'metas' },

      // Avaliação 2 - SistemaGB (30 perguntas)
      { session_id: 2, question_number: 1, question_text: 'Como você se sente emocionalmente hoje?', response_value: 7, response_text: 'Equilibrado', category: 'emocional' },
      { session_id: 2, question_number: 2, question_text: 'Qual seu nível de estresse?', response_value: 6, response_text: 'Moderado', category: 'emocional' },
      { session_id: 2, question_number: 3, question_text: 'Como você lida com frustrações?', response_value: 8, response_text: 'Análise e resolução', category: 'emocional' },
      { session_id: 2, question_number: 4, question_text: 'Qual sua capacidade de resiliência?', response_value: 7, response_text: 'Boa', category: 'emocional' },
      { session_id: 2, question_number: 5, question_text: 'Como você expressa emoções?', response_value: 6, response_text: 'Abertamente', category: 'emocional' },
      { session_id: 2, question_number: 6, question_text: 'Qual seu nível de ansiedade?', response_value: 5, response_text: 'Baixo', category: 'emocional' },
      { session_id: 2, question_number: 7, question_text: 'Como você pratica autocuidado?', response_value: 8, response_text: 'Rotina diária', category: 'emocional' },
      { session_id: 2, question_number: 8, question_text: 'Qual sua capacidade de empatia?', response_value: 9, response_text: 'Excelente', category: 'emocional' },
      { session_id: 2, question_number: 9, question_text: 'Como você gerencia conflitos?', response_value: 7, response_text: 'Diálogo construtivo', category: 'emocional' },
      { session_id: 2, question_number: 10, question_text: 'Qual seu nível de autoconfiança?', response_value: 8, response_text: 'Alto', category: 'emocional' },
      { session_id: 2, question_number: 11, question_text: 'Como você pratica mindfulness?', response_value: 6, response_text: 'Meditação diária', category: 'mental' },
      { session_id: 2, question_number: 12, question_text: 'Qual sua clareza mental?', response_value: 8, response_text: 'Muito boa', category: 'mental' },
      { session_id: 2, question_number: 13, question_text: 'Como você mantém foco?', response_value: 7, response_text: 'Técnicas específicas', category: 'mental' },
      { session_id: 2, question_number: 14, question_text: 'Qual sua capacidade de decisão?', response_value: 8, response_text: 'Rápida e assertiva', category: 'mental' },
      { session_id: 2, question_number: 15, question_text: 'Como você processa informações?', response_value: 9, response_text: 'Análise detalhada', category: 'mental' },
      { session_id: 2, question_number: 16, question_text: 'Qual sua criatividade?', response_value: 7, response_text: 'Boa', category: 'mental' },
      { session_id: 2, question_number: 17, question_text: 'Como você resolve problemas?', response_value: 8, response_text: 'Método sistemático', category: 'mental' },
      { session_id: 2, question_number: 18, question_text: 'Qual sua memória?', response_value: 6, response_text: 'Regular', category: 'mental' },
      { session_id: 2, question_number: 19, question_text: 'Como você aprende?', response_value: 9, response_text: 'Múltiplas estratégias', category: 'mental' },
      { session_id: 2, question_number: 20, question_text: 'Qual sua curiosidade intelectual?', response_value: 8, response_text: 'Alta', category: 'mental' },
      { session_id: 2, question_number: 21, question_text: 'Como você se relaciona socialmente?', response_value: 7, response_text: 'Facilmente', category: 'social' },
      { session_id: 2, question_number: 22, question_text: 'Qual sua rede de apoio?', response_value: 8, response_text: 'Forte', category: 'social' },
      { session_id: 2, question_number: 23, question_text: 'Como você comunica?', response_value: 7, response_text: 'Clara e objetiva', category: 'social' },
      { session_id: 2, question_number: 24, question_text: 'Qual sua capacidade de liderança?', response_value: 6, response_text: 'Em desenvolvimento', category: 'social' },
      { session_id: 2, question_number: 25, question_text: 'Como você trabalha em equipe?', response_value: 8, response_text: 'Colaborativo', category: 'social' },
      { session_id: 2, question_number: 26, question_text: 'Qual sua assertividade?', response_value: 7, response_text: 'Boa', category: 'social' },
      { session_id: 2, question_number: 27, question_text: 'Como você constrói relacionamentos?', response_value: 8, response_text: 'Genuinamente', category: 'social' },
      { session_id: 2, question_number: 28, question_text: 'Qual sua inteligência emocional?', response_value: 9, response_text: 'Excelente', category: 'social' },
      { session_id: 2, question_number: 29, question_text: 'Como você lida com críticas?', response_value: 6, response_text: 'Construtivamente', category: 'social' },
      { session_id: 2, question_number: 30, question_text: 'Qual sua capacidade de influência?', response_value: 7, response_text: 'Moderada', category: 'social' }
    ];

    console.log('📝 Inserindo respostas completas...');
    for (const resposta of respostasCompletas) {
      const { data, error } = await supabase
        .from('session_responses')
        .upsert(resposta, { onConflict: 'id' });
        
      if (error) {
        console.error(`❌ Erro ao inserir resposta:`, error);
      } else {
        console.log(`✅ Resposta ${resposta.question_number} inserida para sessão ${resposta.session_id}`);
      }
    }

    console.log('🎉 Avaliações completas criadas com sucesso!');
    console.log('📋 Resumo:');
    console.log('- 5 avaliações completas inseridas');
    console.log('- 55 respostas detalhadas inseridas');
    console.log('- SistemaTizeCoach: 25 perguntas por avaliação');
    console.log('- SistemaGB: 30 perguntas por avaliação');
    console.log('- Categorias: metas, emocional, mental, social');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

criarAvaliacoesCompletas(); 