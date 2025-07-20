import { createClient } from '@supabase/supabase-js';

const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');

async function testarAvaliacao() {
  console.log('=== TESTANDO AVALIAÇÃO ===');
  
  try {
    // Buscar usuário criado
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('Erro ao listar usuários:', listError.message);
      return;
    }
    
    const user = users.users.find(u => u.email === 'teste@instituto.com');
    if (!user) {
      console.log('Usuário não encontrado');
      return;
    }
    
    console.log('Usuário encontrado:', user.id);
    
    // Tentar enviar avaliação simples
    const { data, error } = await supabase
      .from('assessments')
      .insert([{
        user_id: user.id,
        category: 'fisica',
        score: 75,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.log('Erro detalhado:', error);
      return;
    }
    
    console.log('✅ Avaliação enviada com sucesso!');
    console.log('Dados:', data);
    
  } catch (error) {
    console.log('Erro geral:', error.message);
  }
}

testarAvaliacao(); 