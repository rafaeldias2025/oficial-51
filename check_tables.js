import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('🔍 Verificando tabelas disponíveis...');

    // Tentar acessar diferentes tabelas
    const tables = [
      'users',
      'profiles', 
      'auth_users',
      'admin_access',
      'coaching_tools',
      'coaching_sessions'
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: Existe`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${table}: Erro ao acessar`);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkTables(); 