import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLarissaUser() {
  try {
    console.log('🔄 Criando usuário Larissa...');

    // 1. Criar usuário no sistema de auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'larissa@institutodossonhos.com',
      password: '10203040',
      email_confirm: true,
      user_metadata: {
        full_name: 'Larissa Barbosa'
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no auth:', authError);
      return;
    }

    console.log('✅ Usuário criado no auth:', authData.user.id);

    // 2. Criar perfil na tabela profiles
    const profileData = {
      id: authData.user.id,
      email: 'larissa@institutodossonhos.com',
      full_name: 'Larissa Barbosa',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Perfil criado:', profile);

    // 3. Verificar se foi criado corretamente
    const { data: checkUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();

    if (checkError) {
      console.error('❌ Erro ao verificar usuário:', checkError);
      return;
    }

    console.log('🎉 Usuário Larissa criado com sucesso!');
    console.log('📋 Detalhes:');
    console.log(`   - ID: ${checkUser.id}`);
    console.log(`   - Nome: ${checkUser.full_name}`);
    console.log(`   - Email: ${checkUser.email}`);
    console.log('\n🔐 Credenciais de Login:');
    console.log('   - Email: larissa@institutodossonhos.com');
    console.log('   - Senha: 10203040');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
createLarissaUser(); 