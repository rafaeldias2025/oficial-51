// Script para criar um usuário administrador
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('🔧 Criando usuário administrador...');

  try {
    // 1. Criar usuário no auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@instituto.com',
      password: 'admin123',
      email_confirm: true
    });

    if (authError) {
      console.log('❌ Erro ao criar usuário auth:', authError);
      return;
    }

    console.log('✅ Usuário auth criado:', authData.user.id);

    // 2. Criar perfil na tabela profiles usando SQL direto
    const { data: profileData, error: profileError } = await supabase
      .rpc('create_complete_user_registration', {
        user_email: 'admin@instituto.com',
        user_name: 'Administrador',
        user_password: 'admin123'
      });

    if (profileError) {
      console.log('❌ Erro ao criar perfil:', profileError);
      console.log('✅ Usuário auth criado com sucesso!');
      console.log('📧 Email: admin@instituto.com');
      console.log('🔑 Senha: admin123');
      console.log('\n🎯 Você pode fazer login com essas credenciais!');
      return;
    }

    console.log('✅ Perfil criado:', profileData);

    console.log('\n🎉 ADMINISTRADOR CRIADO COM SUCESSO!');
    console.log('📧 Email: admin@instituto.com');
    console.log('🔑 Senha: admin123');
    console.log('\n🎯 Agora você pode fazer login com essas credenciais!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
createAdminUser(); 