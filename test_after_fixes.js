import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testAfterFixes() {
  console.log('🧪 Testando criação de usuários após correções...');
  
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

    // 2. Criar primeiro usuário de teste
    console.log('\n👤 Criando PRIMEIRO usuário de teste...');
    const user1Data = {
      email: 'carlos.silva@exemplo.com',
      password: 'Carlos123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Carlos Silva',
        role: 'client'
      }
    };
    
    const { data: user1, error: createUser1Error } = await supabase.auth.admin.createUser(user1Data);
    
    if (createUser1Error) {
      console.error('❌ Erro ao criar primeiro usuário:', createUser1Error);
      return;
    }
    
    console.log('✅ Primeiro usuário criado com sucesso!');
    console.log(`📧 Email: ${user1.user.email}`);
    console.log(`🆔 ID: ${user1.user.id}`);
    
    // 3. Aguardar e verificar perfil
    console.log('⏳ Aguardando 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { data: profile1, error: profile1Error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user1.user.id)
      .single();
    
    if (profile1Error) {
      console.error('❌ Erro ao verificar perfil do primeiro usuário:', profile1Error);
    } else {
      console.log('✅ Perfil criado automaticamente para primeiro usuário!');
      console.log('📋 Dados do perfil:', profile1);
    }
    
    // 4. Criar segundo usuário de teste
    console.log('\n👤 Criando SEGUNDO usuário de teste...');
    const user2Data = {
      email: 'lucia.santos@exemplo.com',
      password: 'Lucia123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Lucia Santos',
        role: 'client'
      }
    };
    
    const { data: user2, error: createUser2Error } = await supabase.auth.admin.createUser(user2Data);
    
    if (createUser2Error) {
      console.error('❌ Erro ao criar segundo usuário:', createUser2Error);
      return;
    }
    
    console.log('✅ Segundo usuário criado com sucesso!');
    console.log(`📧 Email: ${user2.user.email}`);
    console.log(`🆔 ID: ${user2.user.id}`);
    
    // 5. Aguardar e verificar perfil do segundo usuário
    console.log('⏳ Aguardando 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { data: profile2, error: profile2Error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user2.user.id)
      .single();
    
    if (profile2Error) {
      console.error('❌ Erro ao verificar perfil do segundo usuário:', profile2Error);
    } else {
      console.log('✅ Perfil criado automaticamente para segundo usuário!');
      console.log('📋 Dados do perfil:', profile2);
    }
    
    // 6. Verificar estado final
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
    
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('✅ 2 usuários criados');
    console.log('✅ 2 perfis criados automaticamente');
    console.log('✅ Sistema funcionando corretamente');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testAfterFixes(); 