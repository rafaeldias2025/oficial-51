import { createClient } from '@supabase/supabase-js';

const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');

async function finalizarTeste() {
  console.log('=== FINALIZANDO TESTE ===');
  
  const userId = '7a5897e3-4bf0-443a-9e80-4ac8e7b9f350'; // ID do usuário criado
  
  try {
    // Verificar se o perfil existe
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
    
    // Enviar avaliação
    console.log('2. Enviando avaliação...');
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: userId,
        category: 'fisica',
        score: 75,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (assessmentError) {
      console.log('Erro ao enviar avaliação:', assessmentError.message);
      return;
    }
    
    console.log('✅ Avaliação enviada com sucesso!');
    console.log('Avaliação ID:', assessment[0].id);
    
    // Verificar avaliações do usuário
    console.log('3. Verificando avaliações...');
    const { data: assessments, error: listError } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId);
    
    if (listError) {
      console.log('Erro ao listar avaliações:', listError.message);
      return;
    }
    
    console.log('✅ Avaliações encontradas:', assessments.length);
    
    console.log('\n=== TESTE CONCLUÍDO COM SUCESSO ===');
    console.log('Usuário: teste@instituto.com');
    console.log('Senha: 123456');
    console.log('ID: ' + userId);
    console.log('Avaliações: ' + assessments.length);
    
  } catch (error) {
    console.log('Erro geral:', error.message);
  }
}

finalizarTeste(); 