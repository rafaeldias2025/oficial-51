import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function removeTestUsers() {
  console.log('🧹 Removendo usuários de teste...');
  
  try {
    // 1. Listar usuários de teste
    console.log('📋 Listando usuários de teste...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erro ao listar usuários:', usersError);
      return;
    }
    
    const testUsers = users.users.filter(user => 
      user.email && user.email.includes('teste-') && user.email.includes('@exemplo.com')
    );
    
    console.log(`📊 Encontrados ${testUsers.length} usuários de teste:`);
    testUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.id})`);
    });
    
    if (testUsers.length === 0) {
      console.log('✅ Nenhum usuário de teste encontrado');
      return;
    }
    
    // 2. Remover perfis dos usuários de teste
    console.log('🗑️  Removendo perfis...');
    const userIds = testUsers.map(user => user.id);
    
    const { error: deleteProfilesError } = await supabase
      .from('profiles')
      .delete()
      .in('user_id', userIds);
    
    if (deleteProfilesError) {
      console.error('❌ Erro ao remover perfis:', deleteProfilesError);
    } else {
      console.log('✅ Perfis removidos');
    }
    
    // 3. Remover usuários de teste
    console.log('🗑️  Removendo usuários...');
    for (const user of testUsers) {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteUserError) {
        console.error(`❌ Erro ao remover usuário ${user.email}:`, deleteUserError);
      } else {
        console.log(`✅ Usuário removido: ${user.email}`);
      }
    }
    
    // 4. Verificar se foram removidos
    console.log('🔍 Verificando se foram removidos...');
    const { data: remainingUsers, error: remainingError } = await supabase.auth.admin.listUsers();
    
    if (remainingError) {
      console.error('❌ Erro ao verificar usuários restantes:', remainingError);
    } else {
      const remainingTestUsers = remainingUsers.users.filter(user => 
        user.email && user.email.includes('teste-') && user.email.includes('@exemplo.com')
      );
      
      if (remainingTestUsers.length === 0) {
        console.log('✅ Todos os usuários de teste foram removidos');
      } else {
        console.log(`⚠️  Ainda existem ${remainingTestUsers.length} usuários de teste`);
      }
    }
    
    // 5. Verificar perfis restantes
    console.log('👤 Verificando perfis restantes...');
    const { data: remainingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erro ao verificar perfis:', profilesError);
    } else {
      console.log(`📊 Total de perfis restantes: ${remainingProfiles.length}`);
      remainingProfiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.user_id}) - Role: ${profile.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

removeTestUsers(); 