import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingUsers() {
  try {
    console.log('🔍 Verificando usuários existentes...');

    // Buscar todos os profiles existentes
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('❌ Erro ao buscar profiles:', error);
      return;
    }

    console.log('✅ Usuários existentes:');
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ID: ${profile.id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Nome: ${profile.full_name}`);
      console.log(`   User ID: ${profile.user_id}`);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkExistingUsers(); 