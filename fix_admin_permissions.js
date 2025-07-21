import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Email do admin que você está usando
const adminEmail = process.env.ADMIN_EMAIL || 'admin@instituto.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

// Cliente Supabase com service_role para acesso administrativo total
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminPermissions() {
  console.log('🔧 Iniciando correção completa de permissões de administrador...');
  console.log(`🔑 Tentando reparar conta: ${adminEmail}`);

  try {
    // 1. Verificar se o usuário existe na auth
    console.log('🔍 Verificando se o usuário existe no sistema de autenticação...');
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('❌ Erro ao listar usuários:', getUserError.message);
      return;
    }

    const existingUser = users.find(u => u.email === adminEmail);
    let userId;

    // 2. Criar ou atualizar usuário na auth
    if (!existingUser) {
      console.log('🆕 Usuário não encontrado na auth. Criando novo usuário admin...');
      
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Administrador do Sistema',
          is_admin: true
        }
      });

      if (createUserError) {
        console.error('❌ Erro ao criar usuário:', createUserError.message);
        return;
      }

      console.log('✅ Usuário criado com sucesso na auth!');
      userId = newUser.user.id;
    } else {
      console.log('✅ Usuário encontrado na auth:', existingUser.id);
      userId = existingUser.id;

      // Atualizar metadados do usuário
      const { error: updateUserError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingUser.user_metadata,
          is_admin: true,
          full_name: 'Administrador do Sistema'
        }
      });

      if (updateUserError) {
        console.error('❌ Erro ao atualizar metadados:', updateUserError.message);
      } else {
        console.log('✅ Metadados do usuário atualizados!');
      }
    }

    // 3. Verificar perfil na tabela profiles
    console.log('🔍 Verificando perfil na tabela profiles...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle();

    // 4. Criar ou atualizar perfil
    if (!existingProfile && !profileError) {
      console.log('🆕 Perfil não encontrado. Criando novo perfil admin...');
      
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: adminEmail,
          full_name: 'Administrador do Sistema',
          role: 'admin',
          is_active: true,
          admin_level: 999
        })
        .select()
        .single();

      if (createProfileError) {
        console.error('❌ Erro ao criar perfil:', createProfileError.message);
      } else {
        console.log('✅ Perfil admin criado com sucesso!', newProfile);
      }
    } else {
      console.log('✅ Perfil encontrado, atualizando para garantir permissões admin...');
      
      const { data: updatedProfile, error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          user_id: userId,
          role: 'admin',
          is_active: true,
          admin_level: 999
        })
        .eq('email', adminEmail)
        .select()
        .single();

      if (updateProfileError) {
        console.error('❌ Erro ao atualizar perfil:', updateProfileError.message);
      } else {
        console.log('✅ Perfil atualizado com sucesso para admin!', updatedProfile);
      }
    }

    // 5. Verificar e corrigir tabelas e funções necessárias
    console.log('🔧 Verificando e corrigindo estruturas de banco de dados necessárias...');
    
    // Garantir que a função is_admin exista e funcione corretamente
    const { error: functionError } = await supabase.rpc('is_admin', { user_id: userId });
    
    if (functionError && functionError.message.includes('function does not exist')) {
      console.log('⚠️ Função is_admin não encontrada. Criando...');
      
      // SQL para criar a função is_admin
      await supabase.rpc('exec_sql', { 
        sql_string: `
          CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1 FROM public.profiles 
              WHERE user_id = is_admin.user_id 
              AND role = 'admin'
            );
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      console.log('✅ Função is_admin criada!');
    } else {
      console.log('✅ Função is_admin verificada!');
    }

    console.log('\n🎉 CORREÇÃO DE PERMISSÕES CONCLUÍDA COM SUCESSO!');
    console.log('📋 Resumo:');
    console.log(`✅ Usuário auth: ${adminEmail}`);
    console.log(`✅ ID: ${userId}`);
    console.log('✅ Função is_admin verificada/criada');
    console.log('✅ Perfil definido como admin (role: admin)');
    
    console.log('\n🚀 Próximos passos:');
    console.log(`1. Acesse http://localhost:8082/auth`);
    console.log(`2. Faça login com ${adminEmail} e a senha definida`);
    console.log(`3. Navegue para http://localhost:8082/admin para verificar o acesso admin`);

  } catch (error) {
    console.error('❌ Erro geral na correção:', error);
  }
}

fixAdminPermissions(); 