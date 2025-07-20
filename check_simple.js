import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkExistingData() {
  console.log('🔍 Verificando dados existentes...');
  
  // Lista de tabelas para verificar
  const tablesToCheck = [
    'profiles', 
    'courses', 
    'tools', 
    'coaching_tools', 
    'assessment_tools', 
    'sessions', 
    'assessments',
    'users',
    'health_metrics',
    'user_sessions'
  ];
  
  for (const tableName of tablesToCheck) {
    try {
      console.log(`\n📋 Verificando tabela: ${tableName}`);
      
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(3);
        
      if (error) {
        console.log(`   ❌ ${error.message}`);
      } else {
        console.log(`   ✅ ${count || 0} registros encontrados`);
        
        if (data && data.length > 0) {
          console.log(`   📋 Colunas: ${Object.keys(data[0]).join(', ')}`);
          
          // Mostrar alguns dados relevantes
          if (tableName === 'profiles') {
            data.forEach(profile => {
              console.log(`      👤 ${profile.email || profile.id} - ${profile.full_name || 'Sem nome'} (role: ${profile.role || 'user'})`);
            });
          } else if (tableName === 'courses') {
            data.forEach(course => {
              console.log(`      📚 ${course.title || course.name || course.id}`);
            });
          } else if (tableName === 'tools' || tableName === 'coaching_tools') {
            data.forEach(tool => {
              console.log(`      🛠️ ${tool.name || tool.title || tool.id}`);
            });
          }
        }
      }
    } catch (err) {
      console.log(`   ❌ Erro inesperado: ${err.message}`);
    }
  }
  
  console.log('\n🎯 Resumo da verificação concluída!');
}

checkExistingData();
