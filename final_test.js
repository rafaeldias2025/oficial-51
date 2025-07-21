import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function finalTest() {
  console.log('🎯 Teste final de criação de usuários...');
  
  try {
    // 1. Verificar estado atual
    console.log('📊 Estado atual:');
    const { data: currentProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erro ao verificar perfis:', profilesError);
    } else {
      console.log(`👤 Perfis existentes: ${currentProfiles.length}`);
      currentProfiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.user_id}) - Role: ${profile.role}`);
      });
    }

    // 2. Criar usuário de teste final
    console.log('\n👤 Criando usuário de teste FINAL...');
    const userData = {
      email: 'teste.final@exemplo.com',
      password: 'Teste123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Usuário Teste Final',
        role: 'client'
      }
    };
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser(userData);
    
    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError);
      return;
    }
    
    console.log('✅ Usuário criado com sucesso!');
    console.log(`📧 Email: ${newUser.user.email}`);
    console.log(`🆔 ID: ${newUser.user.id}`);
    
    // 3. Aguardar e verificar perfil
    console.log('⏳ Aguardando 5 segundos para o trigger executar...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', newUser.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao verificar perfil:', profileError);
      console.log('🔧 Tentando criar perfil manualmente...');
      
      const { data: manualProfile, error: manualError } = await supabase
        .from('profiles')
        .insert({
          user_id: newUser.user.id,
          email: newUser.user.email,
          full_name: 'Usuário Teste Final',
          role: 'client'
        })
        .select()
        .single();
      
      if (manualError) {
        console.error('❌ Erro ao criar perfil manualmente:', manualError);
        console.log('🔍 Verificando estrutura da tabela...');
        
        // Verificar estrutura da tabela
        const { data: tableStructure, error: structureError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        
        if (structureError) {
          console.error('❌ Erro ao verificar estrutura:', structureError);
        } else {
          console.log('📋 Estrutura da tabela profiles:', Object.keys(tableStructure[0] || {}));
        }
      } else {
        console.log('✅ Perfil criado manualmente:', manualProfile);
      }
    } else {
      console.log('✅ Perfil criado automaticamente pelo trigger!');
      console.log('📋 Dados do perfil:', newProfile);
    }
    
    // 4. Verificar estado final
    console.log('\n📊 Estado final:');
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('*');
    
    if (finalError) {
      console.error('❌ Erro ao verificar perfis finais:', finalError);
    } else {
      console.log(`👤 Total de perfis: ${finalProfiles.length}`);
      finalProfiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.user_id}) - Role: ${profile.role}`);
      });
    }
    
    // 5. Verificar todos os usuários
    console.log('\n👥 Verificando todos os usuários:');
    const { data: allUsers, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erro ao listar usuários:', usersError);
    } else {
      console.log(`📊 Total de usuários: ${allUsers.users.length}`);
      allUsers.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`);
      });
    }
    
    console.log('\n🎉 Teste final concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

finalTest(); 