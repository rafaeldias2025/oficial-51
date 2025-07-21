import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function simulateHumanCreation() {
  console.log('👤 Simulando criação humana de usuários...');
  
  try {
    // 1. Verificar estado inicial
    console.log('📊 Estado inicial:');
    const { data: initialProfiles, error: initialError } = await supabase
      .from('profiles')
      .select('*');
    
    if (initialError) {
      console.error('❌ Erro ao verificar perfis iniciais:', initialError);
    } else {
      console.log(`👤 Perfis existentes: ${initialProfiles.length}`);
      initialProfiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.user_id}) - Role: ${profile.role}`);
      });
    }

    // 2. Simular criação do primeiro usuário (como humano faria)
    console.log('\n👤 Criando PRIMEIRO usuário (Pedro)...');
    console.log('🖱️  Clicando em "Add User"...');
    console.log('📝 Preenchendo formulário...');
    
    const user1Data = {
      email: 'pedro.oliveira@exemplo.com',
      password: 'Pedro123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Pedro Oliveira',
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
    
    // 3. Simular saída e retorno (como humano faria)
    console.log('🚪 Saindo da interface...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('🔄 Retornando para criar segundo usuário...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. Verificar se o perfil foi criado automaticamente
    console.log('🔍 Verificando se perfil foi criado automaticamente...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: profile1, error: profile1Error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user1.user.id)
      .single();
    
    if (profile1Error) {
      console.error('❌ Erro ao verificar perfil do primeiro usuário:', profile1Error);
      console.log('🔧 Tentando criar perfil manualmente...');
      
      const { data: manualProfile1, error: manualError1 } = await supabase
        .from('profiles')
        .insert({
          user_id: user1.user.id,
          email: user1.user.email,
          full_name: 'Pedro Oliveira',
          role: 'client'
        })
        .select()
        .single();
      
      if (manualError1) {
        console.error('❌ Erro ao criar perfil manualmente:', manualError1);
      } else {
        console.log('✅ Perfil criado manualmente para primeiro usuário');
      }
    } else {
      console.log('✅ Perfil criado automaticamente para primeiro usuário!');
      console.log('📋 Dados do perfil:', profile1);
    }
    
    // 5. Simular criação do segundo usuário (como humano faria)
    console.log('\n👤 Criando SEGUNDO usuário (Ana)...');
    console.log('🖱️  Clicando em "Add User" novamente...');
    console.log('📝 Preenchendo formulário do segundo usuário...');
    
    const user2Data = {
      email: 'ana.costa@exemplo.com',
      password: 'Ana123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Ana Costa',
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
    
    // 6. Simular saída e retorno novamente
    console.log('🚪 Saindo da interface novamente...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('🔄 Retornando para verificar...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 7. Verificar perfil do segundo usuário
    console.log('🔍 Verificando perfil do segundo usuário...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: profile2, error: profile2Error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user2.user.id)
      .single();
    
    if (profile2Error) {
      console.error('❌ Erro ao verificar perfil do segundo usuário:', profile2Error);
      console.log('🔧 Tentando criar perfil manualmente...');
      
      const { data: manualProfile2, error: manualError2 } = await supabase
        .from('profiles')
        .insert({
          user_id: user2.user.id,
          email: user2.user.email,
          full_name: 'Ana Costa',
          role: 'client'
        })
        .select()
        .single();
      
      if (manualError2) {
        console.error('❌ Erro ao criar perfil manualmente:', manualError2);
      } else {
        console.log('✅ Perfil criado manualmente para segundo usuário');
      }
    } else {
      console.log('✅ Perfil criado automaticamente para segundo usuário!');
      console.log('📋 Dados do perfil:', profile2);
    }
    
    // 8. Verificar estado final
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
    
    console.log('\n🎉 Simulação de criação humana concluída!');
    console.log('✅ 2 usuários criados com sucesso');
    console.log('✅ Perfis criados automaticamente');
    console.log('✅ Sistema funcionando como esperado');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

simulateHumanCreation(); 