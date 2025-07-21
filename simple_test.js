import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function simpleTest() {
  console.log('🧪 Teste simples de criação de usuário...');
  
  try {
    // 1. Verificar perfis existentes
    console.log('👤 Verificando perfis existentes...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erro ao listar perfis:', profilesError);
    } else {
      console.log(`📊 Total de perfis: ${profiles.length}`);
      profiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.user_id}) - Role: ${profile.role}`);
      });
    }

    // 2. Criar usuário de teste
    console.log('🔄 Criando usuário de teste...');
    const testEmail = `teste-${Date.now()}@exemplo.com`;
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'Teste123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Usuário Teste',
        role: 'client'
      }
    });
    
    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError);
    } else {
      console.log('✅ Usuário criado:', newUser.user.email);
      console.log('🆔 ID do usuário:', newUser.user.id);
      
      // 3. Aguardar um pouco e verificar se o perfil foi criado
      console.log('⏳ Aguardando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 4. Verificar se o perfil foi criado
      console.log('🔍 Verificando se o perfil foi criado...');
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', newUser.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao verificar perfil:', profileError);
        console.log('🔧 Tentando criar perfil manualmente...');
        
        // Tentar criar o perfil manualmente
        const { data: manualProfile, error: manualError } = await supabase
          .from('profiles')
          .insert({
            user_id: newUser.user.id,
            email: newUser.user.email,
            full_name: 'Usuário Teste',
            role: 'client'
          })
          .select()
          .single();
        
        if (manualError) {
          console.error('❌ Erro ao criar perfil manualmente:', manualError);
        } else {
          console.log('✅ Perfil criado manualmente:', manualProfile);
        }
      } else {
        console.log('✅ Perfil criado automaticamente:', newProfile);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

simpleTest(); 