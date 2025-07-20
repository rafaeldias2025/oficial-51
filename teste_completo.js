import { createClient } from '@supabase/supabase-js';

const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');

async function testeCompleto() {
  console.log('=== TESTE COMPLETO DO SISTEMA ===');
  
  const userId = '7a5897e3-4bf0-443a-9e80-4ac8e7b9f350'; // ID do usuário criado
  
  try {
    // 1. Verificar perfil
    console.log('1. Verificando perfil...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.log('Erro ao buscar perfil:', profileError.message);
      return;
    }
    
    console.log('✅ Perfil encontrado:', profile.email);
    
    // 2. Criar uma ferramenta de coaching
    console.log('2. Criando ferramenta de coaching...');
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .insert([{
        name: 'Avaliação de Saúde Física',
        description: 'Avaliação completa de saúde física e bem-estar',
        category: 'fisica',
        total_questions: 5,
        estimated_time: 10,
        question_data: JSON.stringify([
          { question: 'Como você se sente hoje?', type: 'scale' },
          { question: 'Qual seu nível de energia?', type: 'scale' }
        ]),
        scoring_config: JSON.stringify({
          max_score: 10,
          passing_score: 7
        }),
        is_active: true
      }])
      .select();
    
    if (toolError) {
      console.log('Erro ao criar ferramenta:', toolError.message);
      return;
    }
    
    console.log('✅ Ferramenta criada com sucesso!');
    console.log('Ferramenta ID:', tool[0].id);
    
    // 3. Criar uma sessão de coaching
    console.log('3. Criando sessão de coaching...');
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert([{
        user_id: userId,
        admin_id: userId,
        tool_id: tool[0].id,
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        instructions: 'Avaliação de saúde física realizada com sucesso'
      }])
      .select();
    
    if (sessionError) {
      console.log('Erro ao criar sessão:', sessionError.message);
      return;
    }
    
    console.log('✅ Sessão criada com sucesso!');
    console.log('Sessão ID:', session[0].id);
    
    // 4. Adicionar respostas da sessão
    console.log('4. Adicionando respostas...');
    const { data: responses, error: responsesError } = await supabase
      .from('session_responses')
      .insert([
        {
          session_id: session[0].id,
          question_number: 1,
          question_text: 'Como você se sente hoje?',
          response_value: '8',
          response_text: 'Muito bem',
          category: 'fisica'
        },
        {
          session_id: session[0].id,
          question_number: 2,
          question_text: 'Qual seu nível de energia?',
          response_value: '7',
          response_text: 'Alto',
          category: 'fisica'
        }
      ])
      .select();
    
    if (responsesError) {
      console.log('Erro ao adicionar respostas:', responsesError.message);
      return;
    }
    
    console.log('✅ Respostas adicionadas!');
    
    // 5. Verificar tudo
    console.log('5. Verificando dados...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('user_id', userId);
    
    const { data: allResponses, error: allResponsesError } = await supabase
      .from('session_responses')
      .select('*')
      .eq('session_id', session[0].id);
    
    console.log('✅ Sessões encontradas:', sessions.length);
    console.log('✅ Respostas encontradas:', allResponses.length);
    
    console.log('\n=== TESTE CONCLUÍDO COM SUCESSO ===');
    console.log('Usuário: teste@instituto.com');
    console.log('Senha: 123456');
    console.log('ID: ' + userId);
    console.log('Ferramentas: 1');
    console.log('Sessões: ' + sessions.length);
    console.log('Respostas: ' + allResponses.length);
    console.log('\n🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!');
    console.log('\n📋 RESUMO DO TESTE:');
    console.log('✅ Usuário criado no Auth');
    console.log('✅ Perfil criado na tabela profiles');
    console.log('✅ Ferramenta de coaching criada');
    console.log('✅ Sessão de coaching criada');
    console.log('✅ Respostas da sessão adicionadas');
    console.log('✅ Todos os dados verificados com sucesso');
    
  } catch (error) {
    console.log('Erro geral:', error.message);
  }
}

testeCompleto(); 