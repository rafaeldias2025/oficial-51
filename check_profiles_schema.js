import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfilesSchema() {
  try {
    console.log('🔍 Verificando estrutura da tabela profiles...');

    // Buscar um perfil existente para ver a estrutura
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao buscar profiles:', error);
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log('✅ Estrutura da tabela profiles:');
      console.log(JSON.stringify(profiles[0], null, 2));
    } else {
      console.log('⚠️ Nenhum perfil encontrado na tabela');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkProfilesSchema(); 