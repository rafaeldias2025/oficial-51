import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkExistingDatabase() {
  console.log('🔍 Verificando banco existente...');
  console.log('📡 Projeto Supabase:', SUPABASE_URL);
  console.log('🆔 ID do Projeto:', SUPABASE_URL.split('//')[1].split('.')[0]);
  
  try {
    // Verificar conexão básica
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (!healthError) {
      console.log('✅ Conexão com Supabase OK');
    } else {
      console.log('❌ Problema na conexão:', healthError.message);
    }
    
    // Tenta verificar tabelas comuns uma por uma
    const commonTables = ['profiles', 'users', 'courses', 'tools', 'coaching_tools', 'assessment_tools', 'sessions', 'assessments'];
    
    for (const tableName of commonTables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        if (!error) {
          console.log(`✅ ${tableName}: ${count || 0} registros`);
          
          // Se tem dados, mostrar uma amostra
          if (count > 0) {
            const { data: sample } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);
            if (sample?.[0]) {
              console.log(`   📋 Colunas: ${Object.keys(sample[0]).join(', ')}`);
            }
          }
        } else {
          console.log(`❌ ${tableName}: ${error.message}`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Erro ao verificar`);
      }
    }
    
    // Verificar se há usuários autenticados
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (!usersError && users) {
      console.log(`👥 Usuários no Auth: ${users.length}`);
      users.slice(0, 3).forEach(user => {
        console.log(`   📧 ${user.email} (criado: ${new Date(user.created_at).toLocaleDateString()})`);
      });
    } else {
      console.log('❌ Não foi possível acessar lista de usuários (precisa de service_role)');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkExistingDatabase();
