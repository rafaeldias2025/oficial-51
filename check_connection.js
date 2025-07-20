import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAdminUsers() {
  console.log('🔍 Verificando usuários admin...');
  
  try {
    // Verificar perfis admin
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, full_name, role, admin_level')
      .or('role.eq.admin,admin_level.gte.100');
      
    if (profilesError) {
      console.log('❌ Erro ao buscar profiles:', profilesError.message);
    } else {
      console.log(`📊 Profiles admin encontrados: ${profiles?.length || 0}`);
      profiles?.forEach(profile => {
        console.log(`   👤 ${profile.email} - ${profile.full_name} (nível: ${profile.admin_level})`);
      });
    }
    
    // Verificar tabelas principais
    const tables = ['courses', 'coaching_tools', 'profiles'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
        
      if (error) {
        console.log(`❌ Tabela ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabela ${table}: OK`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkAdminUsers();
