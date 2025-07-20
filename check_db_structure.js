import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabase() {
  console.log('🔍 Verificando estrutura do banco...');
  
  try {
    // Verificar estrutura da tabela profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
      
    if (profilesError) {
      console.log('❌ Erro ao buscar profiles:', profilesError.message);
    } else {
      console.log(`📊 Profiles encontrados: ${profiles?.length || 0}`);
      if (profiles?.length > 0) {
        console.log('📋 Colunas em profiles:', Object.keys(profiles[0]));
        profiles.forEach(profile => {
          console.log(`   👤 ${profile.email} - ${profile.full_name} (role: ${profile.role})`);
        });
      }
    }
    
    // Verificar se tabela tools existe
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
      
    if (toolsError) {
      console.log('❌ Tabela tools:', toolsError.message);
    } else {
      console.log('✅ Tabela tools: OK');
    }
    
    // Verificar se tabela assessment_tools existe
    const { data: assessmentTools, error: assessmentError } = await supabase
      .from('assessment_tools')
      .select('*')
      .limit(1);
      
    if (assessmentError) {
      console.log('❌ Tabela assessment_tools:', assessmentError.message);
    } else {
      console.log('✅ Tabela assessment_tools: OK');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkDatabase();
