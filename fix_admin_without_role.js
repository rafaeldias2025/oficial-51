import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de emails de administradores
const adminEmails = [
  'admin@instituto.com',
  'admin@sonhos.com',
  'admin@example.com',
  'rafael@admin.com',
  'rafael@institutodossonhos.com',
  'institutodossonhos@gmail.com',
  'admin@test.com'
];

async function fixAdminsWithoutRole() {
  console.log('🔄 Iniciando correção de administradores sem a role correta...');
  try {
    // 1. Buscar todos os perfis dos emails admin
    const { data: adminProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('email', adminEmails);

    if (profilesError) {
      console.error('❌ Erro ao buscar perfis:', profilesError.message);
      return;
    }

    console.log(`🔍 Encontrados ${adminProfiles?.length || 0} perfis de administradores na base de dados`);
    
    if (!adminProfiles || adminProfiles.length === 0) {
      console.log('⚠️ Nenhum perfil de administrador encontrado. Verifique se os emails estão corretos.');
      return;
    }

    // 2. Verificar e corrigir os perfis sem role admin
    let updatedCount = 0;
    let alreadyCorrectCount = 0;
    
    for (const profile of adminProfiles) {
      if (profile.role !== 'admin') {
        console.log(`🔧 Corrigindo perfil de ${profile.email} (${profile.id}) - Role atual: ${profile.role || 'não definida'}`);
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'admin',
            is_active: true,
            admin_level: profile.admin_level || 100
          })
          .eq('id', profile.id)
          .select();
        
        if (updateError) {
          console.error(`❌ Erro ao atualizar perfil de ${profile.email}:`, updateError.message);
        } else {
          console.log(`✅ Perfil de ${profile.email} atualizado para admin com sucesso!`);
          updatedCount++;
        }
      } else {
        console.log(`✅ Perfil de ${profile.email} já está com role admin`);
        alreadyCorrectCount++;
      }
    }
    
    // 3. Verificar emails admin que não têm perfil e criar para eles
    const emailsWithProfiles = adminProfiles.map(profile => profile.email);
    const emailsWithoutProfiles = adminEmails.filter(email => !emailsWithProfiles.includes(email));
    
    if (emailsWithoutProfiles.length > 0) {
      console.log(`\n⚠️ Encontrados ${emailsWithoutProfiles.length} emails admin sem perfil na base de dados.`);
      
      for (const email of emailsWithoutProfiles) {
        console.log(`🔧 Tentando criar perfil para ${email}...`);
        
        // Verificar se existe um usuário auth para este email
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
        
        if (getUserError) {
          console.error(`❌ Erro ao verificar usuários auth:`, getUserError.message);
          continue;
        }
        
        const authUser = users.find(u => u.email === email);
        
        if (!authUser) {
          console.log(`⚠️ Usuário auth não encontrado para ${email}. Não é possível criar o perfil.`);
          continue;
        }
        
        // Criar perfil para o usuário auth
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: authUser.id,
            email: email,
            full_name: authUser.user_metadata?.full_name || 'Administrador do Sistema',
            role: 'admin',
            is_active: true,
            admin_level: 100
          })
          .select();
        
        if (createError) {
          console.error(`❌ Erro ao criar perfil para ${email}:`, createError.message);
        } else {
          console.log(`✅ Perfil admin criado com sucesso para ${email}!`);
          updatedCount++;
        }
      }
    }

    // Resumo das operações
    console.log('\n📊 RESUMO DA CORREÇÃO:');
    console.log(`✅ Perfis já corretos: ${alreadyCorrectCount}`);
    console.log(`✅ Perfis atualizados/criados: ${updatedCount}`);
    console.log(`⚠️ Emails sem perfil: ${emailsWithoutProfiles.length}`);
    
    console.log('\n🎉 PROCESSO DE CORREÇÃO CONCLUÍDO!');
    console.log('\n🚀 Próximos passos:');
    console.log('1. Faça logout se estiver logado');
    console.log('2. Acesse http://localhost:8082/auth');
    console.log('3. Faça login com um dos emails admin');
    console.log('4. Tente acessar http://localhost:8082/admin');

  } catch (error) {
    console.error('❌ Erro geral na correção:', error);
  }
}

fixAdminsWithoutRole(); 