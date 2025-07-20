import { createClient } from '@supabase/supabase-js';

const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');

async function testeFinal() {
  console.log('=== TESTE FINAL COMPLETO ===');
  
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
    
    // 2. Criar uma sessão de coaching (simulando avaliação)
    console.log('2. Criando sessão de coaching...');
    const { data: session, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert([{
        user_id: userId,
        admin_id: userId, // Usando o mesmo ID como admin
        tool_id: 1,
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
    
    // 3. Adicionar respostas da sessão
    console.log('3. Adicionando respostas...');
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
    
    // 4. Verificar sessões do usuário
    console.log('4. Verificando sessões...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (sessionsError) {
      console.log('Erro ao listar sessões:', sessionsError.message);
      return;
    }
    
    console.log('✅ Sessões encontradas:', sessions.length);
    
    // 5. Verificar respostas
    const { data: allResponses, error: allResponsesError } = await supabase
      .from('session_responses')
      .select('*')
      .eq('session_id', session[0].id);
    
    if (allResponsesError) {
      console.log('Erro ao listar respostas:', allResponsesError.message);
      return;
    }
    
    console.log('✅ Respostas encontradas:', allResponses.length);
    
    console.log('\n=== TESTE CONCLUÍDO COM SUCESSO ===');
    console.log('Usuário: teste@instituto.com');
    console.log('Senha: 123456');
    console.log('ID: ' + userId);
    console.log('Sessões: ' + sessions.length);
    console.log('Respostas: ' + allResponses.length);
    console.log('\n🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!');
    
  } catch (error) {
    console.log('Erro geral:', error.message);
  }
}

testeFinal(); 