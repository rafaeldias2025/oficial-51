import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfilesSchema() {
  try {
    console.log('🔍 Verificando estrutura da tabela profiles...');

    // 1. Verificar estrutura da tabela profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log('📋 ESTRUTURA DA TABELA PROFILES:');
      const profile = profiles[0];
      Object.keys(profile).forEach(key => {
        console.log(`- ${key}: ${typeof profile[key]} = ${JSON.stringify(profile[key])}`);
      });
    }

    // 2. Verificar se existe tabela auth.users
    console.log('\n🔍 Verificando tabela auth.users...');
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('*')
      .limit(1);

    if (authError) {
      console.log('⚠️ Erro ao acessar auth.users:', authError.message);
    } else if (authUsers && authUsers.length > 0) {
      console.log('📋 ESTRUTURA DA TABELA AUTH.USERS:');
      const authUser = authUsers[0];
      Object.keys(authUser).forEach(key => {
        console.log(`- ${key}: ${typeof authUser[key]} = ${JSON.stringify(authUser[key])}`);
      });
    }

    // 3. Verificar políticas de acesso
    console.log('\n🔍 Verificando políticas de acesso...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'coaching_tools' });

    if (policiesError) {
      console.log('⚠️ Erro ao verificar políticas:', policiesError.message);
    } else {
      console.log('📋 POLÍTICAS ENCONTRADAS:', policies);
    }

    console.log('\n💡 SOLUÇÃO ALTERNATIVA:');
    console.log('Como raw_user_meta_data não existe em profiles, vamos:');
    console.log('1. Criar uma coluna admin_level na tabela profiles');
    console.log('2. Ou usar uma tabela separada para permissões');
    console.log('3. Ou modificar a política para usar uma coluna existente');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkProfilesSchema(); 