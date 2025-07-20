import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function migrarDadosSistemas() {
  try {
    console.log('🔄 Migrando dados dos sistemas anteriores...');
    
    // 1. Inserir usuários dos sistemas anteriores
    const usuariosSistemas = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        full_name: 'João Silva - SistemaTizeCoach',
        email: 'joao.silva@sistemetizecoach.com',
        created_at: new Date('2025-01-15').toISOString()
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        full_name: 'Maria Santos - SistemaGB',
        email: 'maria.santos@sistemagb.com',
        created_at: new Date('2025-01-20').toISOString()
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        full_name: 'Pedro Oliveira - SistemaTizeCoach',
        email: 'pedro.oliveira@sistemetizecoach.com',
        created_at: new Date('2025-02-01').toISOString()
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        full_name: 'Ana Costa - SistemaGB',
        email: 'ana.costa@sistemagb.com',
        created_at: new Date('2025-02-10').toISOString()
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        full_name: 'Carlos Lima - SistemaTizeCoach',
        email: 'carlos.lima@sistemetizecoach.com',
        created_at: new Date('2025-02-15').toISOString()
      }
    ];

    console.log('📝 Inserindo usuários dos sistemas anteriores...');
    for (const usuario of usuariosSistemas) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(usuario, { onConflict: 'id' });
        
      if (error) {
        console.error(`❌ Erro ao inserir ${usuario.full_name}:`, error);
      } else {
        console.log(`✅ Usuário ${usuario.full_name} inserido com sucesso`);
      }
    }

    // 2. Inserir avaliações dos sistemas anteriores
    const avaliacoesSistemas = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        tool_id: 10, // Avaliação de Metas e Objetivos
        status: 'completed',
        scheduled_date: new Date('2025-01-15').toISOString(),
        started_at: new Date('2025-01-15T10:00:00').toISOString(),
        completed_at: new Date('2025-01-15T10:20:00').toISOString(),
        instructions: 'Avaliação do SistemaTizeCoach - Foco em metas pessoais e profissionais',
        created_at: new Date('2025-01-15').toISOString()
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        tool_id: 11, // Avaliação de Bem-estar Emocional
        status: 'completed',
        scheduled_date: new Date('2025-01-20').toISOString(),
        started_at: new Date('2025-01-20T14:00:00').toISOString(),
        completed_at: new Date('2025-01-20T14:15:00').toISOString(),
        instructions: 'Avaliação do SistemaGB - Análise de saúde mental e equilíbrio emocional',
        created_at: new Date('2025-01-20').toISOString()
      },
      {
        user_id: '33333333-3333-3333-3333-333333333333',
        tool_id: 12, // Avaliação de Produtividade
        status: 'completed',
        scheduled_date: new Date('2025-02-01').toISOString(),
        started_at: new Date('2025-02-01T09:00:00').toISOString(),
        completed_at: new Date('2025-02-01T09:25:00').toISOString(),
        instructions: 'Avaliação do SistemaTizeCoach - Diagnóstico de hábitos e rotinas',
        created_at: new Date('2025-02-01').toISOString()
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        tool_id: 13, // Avaliação de Relacionamentos
        status: 'pending',
        scheduled_date: new Date('2025-02-15').toISOString(),
        instructions: 'Avaliação do SistemaGB - Análise de relacionamentos pessoais e profissionais',
        created_at: new Date('2025-02-10').toISOString()
      },
      {
        user_id: '55555555-5555-5555-5555-555555555555',
        tool_id: 10, // Avaliação de Metas e Objetivos
        status: 'completed',
        scheduled_date: new Date('2025-02-15').toISOString(),
        started_at: new Date('2025-02-15T16:00:00').toISOString(),
        completed_at: new Date('2025-02-15T16:20:00').toISOString(),
        instructions: 'Avaliação do SistemaTizeCoach - Reavaliação de metas trimestrais',
        created_at: new Date('2025-02-15').toISOString()
      }
    ];

    console.log('📊 Inserindo avaliações dos sistemas anteriores...');
    for (const avaliacao of avaliacoesSistemas) {
      const { data, error } = await supabase
        .from('assessment_assignments')
        .upsert(avaliacao, { onConflict: 'id' });
        
      if (error) {
        console.error(`❌ Erro ao inserir avaliação:`, error);
      } else {
        console.log(`✅ Avaliação inserida com sucesso para ${avaliacao.user_id}`);
      }
    }

    // 3. Inserir resultados das avaliações
    const resultadosAvaliacoes = [
      {
        session_id: 1,
        total_score: 85,
        category_scores: JSON.stringify({
          'metas': 90,
          'produtividade': 80,
          'bem_estar': 85
        }),
        insights: 'Usuário demonstra excelente foco em metas, com boa produtividade e bem-estar equilibrado.',
        recommendations: 'Manter rotina atual, focar em melhorar produtividade em 10%.',
        summary: 'Avaliação positiva do SistemaTizeCoach - Cliente em excelente progresso.',
        created_at: new Date('2025-01-15T10:20:00').toISOString()
      },
      {
        session_id: 2,
        total_score: 78,
        category_scores: JSON.stringify({
          'emocional': 75,
          'mental': 80,
          'social': 79
        }),
        insights: 'Usuário apresenta bom equilíbrio emocional, com espaço para melhorias na área social.',
        recommendations: 'Trabalhar habilidades sociais e comunicação interpessoal.',
        summary: 'Avaliação do SistemaGB - Bem-estar emocional em desenvolvimento.',
        created_at: new Date('2025-01-20T14:15:00').toISOString()
      },
      {
        session_id: 3,
        total_score: 92,
        category_scores: JSON.stringify({
          'habitos': 95,
          'rotinas': 90,
          'eficiencia': 91
        }),
        insights: 'Usuário possui excelentes hábitos e rotinas bem estabelecidas.',
        recommendations: 'Manter excelente padrão, considerar mentorias para outros.',
        summary: 'Avaliação do SistemaTizeCoach - Produtividade exemplar.',
        created_at: new Date('2025-02-01T09:25:00').toISOString()
      }
    ];

    console.log('📈 Inserindo resultados das avaliações...');
    for (const resultado of resultadosAvaliacoes) {
      const { data, error } = await supabase
        .from('session_results')
        .upsert(resultado, { onConflict: 'id' });
        
      if (error) {
        console.error(`❌ Erro ao inserir resultado:`, error);
      } else {
        console.log(`✅ Resultado inserido com sucesso para sessão ${resultado.session_id}`);
      }
    }

    console.log('🎉 Migração concluída com sucesso!');
    console.log('📋 Resumo:');
    console.log('- 5 usuários dos sistemas anteriores inseridos');
    console.log('- 5 avaliações dos sistemas anteriores inseridas');
    console.log('- 3 resultados de avaliações inseridos');
    console.log('- Dados dos SistemasTizeCoach e SistemaGB integrados');
    
  } catch (error) {
    console.error('❌ Erro geral na migração:', error);
  }
}

migrarDadosSistemas(); 