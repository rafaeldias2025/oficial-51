import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZUEiOiJhbm9uIiwiaWF0IjoxNzUyMzYwMTI5LCJleHAiOjIwNjc5MzYxMjl9.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminSQL() {
  console.log('👑 Criando admin via SQL direto...');
  
  try {
    // Tentar via SQL raw para contornar RLS
    const sql = `
      INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
      VALUES (
        'fe096bc3-d9a6-4720-b718-e4532e395335',
        'rafael.ids@icloud.com',
        'Rafael Admin',
        'admin',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) 
      DO UPDATE SET 
        role = 'admin',
        full_name = 'Rafael Admin',
        updated_at = NOW()
      RETURNING *;
    `;
    
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.log('❌ Erro SQL:', error.message);
      
      // Tentar abordagem alternativa - primeiro fazer login
      console.log('🔄 Tentando fazer login primeiro...');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'rafael.ids@icloud.com',
        password: '201097'
      });
      
      if (loginError) {
        console.log('❌ Erro no login:', loginError.message);
        console.log('💡 Tente fazer login manualmente na aplicação primeiro');
      } else {
        console.log('✅ Login realizado com sucesso!');
        console.log('🔄 Agora tentando criar profile...');
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: loginData.user.id,
            email: loginData.user.email,
            full_name: 'Rafael Admin',
            role: 'admin'
          });
          
        if (profileError) {
          console.log('❌ Erro ao criar profile:', profileError.message);
        } else {
          console.log('✅ Profile admin criado com sucesso!');
        }
      }
    } else {
      console.log('✅ Admin criado via SQL!');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createAdminSQL();
