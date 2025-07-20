import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function detailedPermissionsReview() {
  try {
    console.log('🔍 REVISÃO DETALHADA DE PERMISSÕES');
    console.log('=' .repeat(50));

    // 1. VERIFICAR ESTRUTURA DA TABELA PROFILES
    console.log('\n📋 1. ESTRUTURA DA TABELA PROFILES:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);

    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
    } else if (profiles && profiles.length > 0) {
      const profile = profiles[0];
      console.log('📊 Colunas disponíveis:');
      Object.keys(profile).forEach(key => {
        console.log(`   - ${key}: ${typeof profile[key]} = ${JSON.stringify(profile[key])}`);
      });
    }

    // 2. VERIFICAR USUÁRIOS EXISTENTES
    console.log('\n📋 2. USUÁRIOS EXISTENTES:');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, admin_level, created_at')
      .order('admin_level', { ascending: false });

    if (!allUsersError && allUsers) {
      allUsers.forEach((user, index) => {
        const level = user.admin_level || 0;
        const status = level >= 999 ? '👑 Super Admin' : level >= 100 ? '🔧 Admin' : '👤 Usuário';
        console.log(`   ${index + 1}. ${user.full_name} (${user.email})`);
        console.log(`      - ID: ${user.id}`);
        console.log(`      - admin_level: ${level} ${status}`);
        console.log(`      - Criado: ${user.created_at}`);
        console.log('');
      });
    }

    // 3. VERIFICAR POLÍTICAS DE ACESSO
    console.log('\n📋 3. POLÍTICAS DE ACESSO (RLS):');
    console.log('   Verificando políticas para coaching_tools...');
    
    // Tentar acessar coaching_tools para ver as políticas
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('*')
      .limit(1);

    if (toolsError) {
      console.log(`   ❌ Erro ao acessar coaching_tools: ${toolsError.message}`);
      console.log(`   💡 Isso pode indicar problemas de permissão`);
    } else {
      console.log('   ✅ Acesso a coaching_tools permitido');
    }

    // 4. VERIFICAR TABELA AUTH.USERS
    console.log('\n📋 4. VERIFICANDO AUTH.USERS:');
    console.log('   Tentando acessar auth.users...');
    
    // Tentar acessar auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .limit(3);

    if (authError) {
      console.log(`   ❌ Erro ao acessar auth.users: ${authError.message}`);
    } else if (authUsers && authUsers.length > 0) {
      console.log('   ✅ Usuários em auth.users:');
      authUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.id})`);
        console.log(`      - raw_user_meta_data: ${JSON.stringify(user.raw_user_meta_data)}`);
        console.log('');
      });
    }

    // 5. VERIFICAR CONFIGURAÇÃO DO SUPABASE
    console.log('\n📋 5. CONFIGURAÇÃO DO SUPABASE:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
    console.log(`   Service Role: Sim`);

    // 6. VERIFICAR TABELAS DO SISTEMA
    console.log('\n📋 6. TABELAS DO SISTEMA:');
    const tables = ['profiles', 'coaching_tools', 'coaching_sessions', 'notifications', 'admin_access'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: Acessível`);
      }
    }

    // 7. ANÁLISE DO PROBLEMA DE LOGIN
    console.log('\n📋 7. ANÁLISE DO PROBLEMA DE LOGIN:');
    console.log('   🔍 Possíveis causas:');
    console.log('   1. Usuário não existe em auth.users');
    console.log('   2. Senha não está criptografada corretamente');
    console.log('   3. Políticas RLS bloqueando acesso');
    console.log('   4. Configuração de autenticação incorreta');
    console.log('   5. Usuário não tem permissões de login');

    // 8. VERIFICAR SE O USUÁRIO SUPER ADMIN EXISTE EM AUTH.USERS
    console.log('\n📋 8. VERIFICANDO SUPER ADMIN EM AUTH.USERS:');
    const superAdminId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    
    const { data: superAdminAuth, error: superAdminAuthError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', superAdminId)
      .single();

    if (superAdminAuthError) {
      console.log(`   ❌ Super Admin não encontrado em auth.users: ${superAdminAuthError.message}`);
      console.log('   💡 Isso explica o erro de login!');
    } else {
      console.log('   ✅ Super Admin encontrado em auth.users:');
      console.log(`      - ID: ${superAdminAuth.id}`);
      console.log(`      - Email: ${superAdminAuth.email}`);
      console.log(`      - raw_user_meta_data: ${JSON.stringify(superAdminAuth.raw_user_meta_data)}`);
    }

    console.log('\n🎯 CONCLUSÃO:');
    console.log('   O problema de login provavelmente está relacionado a:');
    console.log('   1. Usuário não existe em auth.users');
    console.log('   2. Senha não está configurada corretamente');
    console.log('   3. Sistema de autenticação não reconhece o usuário');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

detailedPermissionsReview(); 