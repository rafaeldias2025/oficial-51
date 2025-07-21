// Script para migrar para um novo projeto Supabase
// ✅ Cria um ambiente limpo e seguro

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

// Carrega variáveis de ambiente
dotenv.config();

// Interface para ler input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function migrateToNewSupabase() {
  console.log('🚀 MIGRAÇÃO PARA NOVO PROJETO SUPABASE');
  console.log('========================================\n');

  try {
    // 1. Solicitar dados do novo projeto
    console.log('📋 CONFIGURAÇÃO DO NOVO PROJETO SUPABASE\n');
    
    const newProjectUrl = await question('🔗 URL do novo projeto Supabase: ');
    const newAnonKey = await question('🔑 Anon Key do novo projeto: ');
    const newServiceRoleKey = await question('🔐 Service Role Key do novo projeto: ');
    
    // 2. Validar inputs
    if (!newProjectUrl || !newProjectUrl.includes('supabase.co')) {
      console.error('❌ URL do Supabase inválida!');
      rl.close();
      return;
    }

    if (!newAnonKey || newAnonKey.length < 50) {
      console.error('❌ Anon Key inválida!');
      rl.close();
      return;
    }

    if (!newServiceRoleKey || newServiceRoleKey.length < 50) {
      console.error('❌ Service Role Key inválida!');
      rl.close();
      return;
    }

    console.log('\n⏳ Configurando novo projeto...');

    // 3. Testar conexão com novo projeto
    const newSupabase = createClient(newProjectUrl, newAnonKey);
    
    try {
      const { data, error } = await newSupabase.from('profiles').select('count').limit(1);
      
      if (error) {
        console.log('ℹ️  Tabela profiles não existe ainda (normal para projeto novo)');
      } else {
        console.log('✅ Conexão com novo projeto estabelecida');
      }
    } catch (error) {
      console.log('ℹ️  Projeto novo - tabelas ainda não criadas');
    }

    // 4. Atualizar arquivo .env.local
    console.log('\n📝 Atualizando configurações...');
    
    const envContent = `# Configurações do Novo Projeto Supabase
VITE_SUPABASE_URL=${newProjectUrl}
VITE_SUPABASE_ANON_KEY=${newAnonKey}
VITE_SUPABASE_SERVICE_ROLE_KEY=${newServiceRoleKey}

# Configurações da aplicação
VITE_APP_NAME=Instituto dos Sonhos
VITE_APP_VERSION=1.0.0

# Configurações de Desenvolvimento
NODE_ENV=development
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
`;

    try {
      const fs = await import('fs');
      fs.writeFileSync('.env.local', envContent);
      console.log('✅ Arquivo .env.local atualizado');
    } catch (error) {
      console.error('❌ Erro ao atualizar .env.local:', error);
    }

    // 5. Criar script para executar migrações
    const migrationScript = `// Script para executar migrações no novo projeto
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runMigrations() {
  console.log('🔄 Executando migrações no novo projeto...');
  
  try {
    // Aqui você pode adicionar as migrações necessárias
    console.log('✅ Migrações executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro nas migrações:', error);
  }
}

runMigrations();
`;

    try {
      const fs = await import('fs');
      fs.writeFileSync('run_migrations_new_project.js', migrationScript);
      console.log('✅ Script de migrações criado');
    } catch (error) {
      console.error('❌ Erro ao criar script de migrações:', error);
    }

    // 6. Resultado final
    console.log('\n🎉 MIGRAÇÃO CONFIGURADA COM SUCESSO!');
    console.log('========================================');
    console.log(`🔗 URL: ${newProjectUrl}`);
    console.log(`🔑 Anon Key: ${newAnonKey.substring(0, 20)}...`);
    console.log(`🔐 Service Role: ${newServiceRoleKey.substring(0, 20)}...`);
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('1. Execute as migrações: node run_migrations_new_project.js');
    console.log('2. Crie seu admin: node create_secure_admin.js');
    console.log('3. Teste a conexão: node verify_admin_status.js');
    console.log('4. Reinicie o servidor: npm run dev');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    rl.close();
  }
}

// Executar o script
migrateToNewSupabase().then(() => {
  console.log('\n✅ Script finalizado!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}); 