import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testManualUserCreation() {
  console.log('🧪 Testando criação manual de usuário...');
  
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

    // 2. Criar usuário como se fosse manual (simulando interface humana)
    console.log('👤 Criando usuário "João Silva"...');
    const userData = {
      email: 'joao.silva@exemplo.com',
      password: 'Joao123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'João Silva',
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
    console.log(`📅 Criado em: ${newUser.user.created_at}`);
    
    // 3. Aguardar um pouco para o trigger executar
    console.log('⏳ Aguardando 3 segundos para o trigger executar...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 4. Verificar se o perfil foi criado automaticamente
    console.log('🔍 Verificando se o perfil foi criado automaticamente...');
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', newUser.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao verificar perfil:', profileError);
      console.log('🔧 O trigger não funcionou. Tentando criar perfil manualmente...');
      
      // Tentar criar o perfil manualmente
      const { data: manualProfile, error: manualError } = await supabase
        .from('profiles')
        .insert({
          user_id: newUser.user.id,
          email: newUser.user.email,
          full_name: 'João Silva',
          role: 'client'
        })
        .select()
        .single();
      
      if (manualError) {
        console.error('❌ Erro ao criar perfil manualmente:', manualError);
        console.log('🔍 Verificando estrutura da tabela profiles...');
        
        // Verificar estrutura da tabela
        const { data: tableInfo, error: tableError } = await supabase
          .rpc('get_table_info', { table_name: 'profiles' });
        
        if (tableError) {
          console.error('❌ Erro ao verificar estrutura da tabela:', tableError);
        } else {
          console.log('📋 Estrutura da tabela profiles:', tableInfo);
        }
      } else {
        console.log('✅ Perfil criado manualmente:', manualProfile);
      }
    } else {
      console.log('✅ Perfil criado automaticamente pelo trigger!');
      console.log('📋 Dados do perfil:', newProfile);
    }
    
    // 5. Verificar estado final
    console.log('📊 Estado final:');
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
    
    console.log('🎉 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testManualUserCreation(); 