import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixDatabase() {
  console.log('🔧 Corrigindo estrutura da database...');
  
  try {
    // 1. Verificar estrutura atual da tabela profiles
    console.log('📋 Verificando estrutura da tabela profiles...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' });
    
    if (columnsError) {
      console.log('❌ Erro ao verificar colunas:', columnsError);
      console.log('🔍 Tentando verificar via SQL direto...');
    } else {
      console.log('✅ Colunas encontradas:', columns);
    }

    // 2. Adicionar coluna role se não existir
    console.log('➕ Adicionando coluna role se necessário...');
    const { error: addRoleError } = await supabase
      .rpc('add_role_column_if_not_exists');
    
    if (addRoleError) {
      console.log('❌ Erro ao adicionar coluna role:', addRoleError);
    } else {
      console.log('✅ Coluna role verificada/criada');
    }

    // 3. Recriar trigger
    console.log('🔧 Recriando trigger...');
    const { error: triggerError } = await supabase
      .rpc('recreate_user_trigger');
    
    if (triggerError) {
      console.log('❌ Erro ao recriar trigger:', triggerError);
    } else {
      console.log('✅ Trigger recriado');
    }

    // 4. Testar criação de usuário
    console.log('🧪 Testando criação de usuário...');
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
      
      // 5. Aguardar e verificar perfil
      console.log('⏳ Aguardando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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

fixDatabase(); 