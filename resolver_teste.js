import { createClient } from '@supabase/supabase-js';

const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');

async function resolverTeste() {
  console.log('=== RESOLVENDO TESTE ===');
  
  try {
    // 1. Criar usuário no Auth
    console.log('1. Criando usuário no Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'teste@instituto.com',
      password: '123456',
      email_confirm: true
    });
    
    if (authError) {
      console.log('Erro ao criar usuário:', authError.message);
      return;
    }
    
    console.log('✅ Usuário criado:', authData.user.id);
    
    // 2. Criar perfil na tabela profiles
    console.log('2. Criando perfil...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: 'teste@instituto.com',
        full_name: 'Usuário Teste'
      }]);
    
    if (profileError) {
      console.log('Erro ao criar perfil:', profileError.message);
      return;
    }
    
    console.log('✅ Perfil criado!');
    
    // 3. Enviar avaliação
    console.log('3. Enviando avaliação...');
    const { error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: authData.user.id,
        category: 'fisica',
        score: 75,
        questions: JSON.stringify([
          { question: 'Como você se sente hoje?', answer: 'Bem', score: 8 },
          { question: 'Qual seu nível de energia?', answer: 'Alto', score: 7 }
        ]),
        created_at: new Date().toISOString()
      }]);
    
    if (assessmentError) {
      console.log('Erro ao enviar avaliação:', assessmentError.message);
      return;
    }
    
    console.log('✅ Avaliação enviada!');
    console.log('\n=== TESTE CONCLUÍDO ===');
    console.log('Usuário: teste@instituto.com');
    console.log('Senha: 123456');
    console.log('ID do usuário:', authData.user.id);
    
  } catch (error) {
    console.log('Erro geral:', error.message);
  }
}

resolverTeste(); 