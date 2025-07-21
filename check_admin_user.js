import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkAndCreateAdminUser() {
  console.log('🔍 Verificando usuário admin padrão...');
  
  try {
    // 1. Verificar se o usuário existe no auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Erro ao listar usuários:', authError);
      return;
    }
    
    const adminUser = authUsers.users.find(user => user.email === 'admin@sonhos.com');
    
    if (adminUser) {
      console.log('✅ Usuário admin encontrado no auth:', adminUser.id);
    } else {
      console.log('⚠️ Usuário admin não encontrado, criando...');
      
      // Criar usuário no auth
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'admin@sonhos.com',
        password: 'Admin123!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Administrador Sistema',
          role: 'admin'
        }
      });
      
      if (createError) {
        console.error('❌ Erro ao criar usuário no auth:', createError);
        return;
      }
      
      console.log('✅ Usuário admin criado no auth:', newUser.user.id);
    }
    
    // 2. Verificar se o perfil existe
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@sonhos.com');
    
    if (profileError) {
      console.error('❌ Erro ao buscar perfis:', profileError);
      return;
    }
    
    if (profiles && profiles.length > 0) {
      const profile = profiles[0];
      console.log('✅ Perfil admin encontrado:', profile.id);
      
      // Verificar se o role está correto
      if (profile.role !== 'admin') {
        console.log('⚠️ Role incorreto, atualizando para admin...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error('❌ Erro ao atualizar role:', updateError);
        } else {
          console.log('✅ Role atualizado para admin');
        }
      }
    } else {
      console.log('⚠️ Perfil não encontrado, criando...');
      
      // Buscar o user_id do usuário admin
      const adminUser = authUsers.users.find(user => user.email === 'admin@sonhos.com');
      
      if (adminUser) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: adminUser.id,
            email: 'admin@sonhos.com',
            full_name: 'Administrador Sistema',
            role: 'admin',
            celular: '(11) 99999-9999',
            data_nascimento: '1990-01-01',
            sexo: 'masculino',
            altura_cm: 180
          });
        
        if (insertError) {
          console.error('❌ Erro ao criar perfil:', insertError);
        } else {
          console.log('✅ Perfil admin criado com sucesso');
        }
      }
    }
    
    console.log('🎉 Verificação concluída!');
    console.log('📧 Email: admin@sonhos.com');
    console.log('🔑 Senha: Admin123!');
    console.log('🌐 Acesse: http://localhost:8083/auth');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkAndCreateAdminUser(); 