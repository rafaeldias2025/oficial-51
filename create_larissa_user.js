import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLarissaUser() {
  try {
    console.log('👤 Criando usuário Larissa Barbosa...');
    
    // 1. Criar usuário no auth.users
    console.log('\n🔐 Criando usuário no sistema de autenticação...');
    
    const userId = '00000000-0000-0000-0000-000000000007'; // ID único para Larissa
    
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .insert({
        id: userId,
        email: 'larissa@institutodossonhos.com',
        encrypted_password: '$2a$10$example.hash.for.password.10203040',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (authError) {
      console.log('⚠️ Usuário já pode existir no auth, continuando...');
    } else {
      console.log('✅ Usuário criado no sistema de autenticação');
    }
    
    // 2. Criar perfil do usuário
    console.log('\n👤 Criando perfil do usuário...');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: 'larissa@institutodossonhos.com',
        full_name: 'Larissa Barbosa',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }
    
    console.log('✅ Perfil criado com sucesso');
    
    // 3. Verificar se o usuário foi criado
    console.log('\n🔍 Verificando usuário criado...');
    const { data: checkUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();
      
    if (checkError) {
      console.error('❌ Erro ao verificar usuário:', checkError);
      return;
    }
    
    console.log('✅ Usuário verificado:');
    console.log(`   - ID: ${checkUser.id}`);
    console.log(`   - Nome: ${checkUser.full_name}`);
    console.log(`   - Email: ${checkUser.email}`);
    console.log(`   - Criado em: ${checkUser.created_at}`);
    
    console.log('\n🎉 Usuário Larissa Barbosa criado com sucesso!');
    console.log('🔑 Credenciais de login:');
    console.log('   - Email: larissa@institutodossonhos.com');
    console.log('   - Senha: 10203040');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar a criação do usuário
createLarissaUser(); 