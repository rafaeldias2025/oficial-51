import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function makeAdmin() {
  console.log('👑 Fazendo login e promovendo a admin...');
  
  try {
    // Fazer login primeiro
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'rafael.ids@icloud.com',
      password: '201097'
    });
    
    if (loginError) {
      console.log('❌ Erro no login:', loginError.message);
      return;
    }
    
    console.log('✅ Login realizado!');
    console.log('🔑 Usuário autenticado:', loginData.user.email);
    
    // Agora com usuário autenticado, tentar criar profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: loginData.user.id,
        email: loginData.user.email,
        full_name: 'Rafael Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select();
      
    if (profileError) {
      console.log('❌ Erro ao criar profile:', profileError.message);
      
      // Tentar inserção simples
      console.log('🔄 Tentando inserção simples...');
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: loginData.user.id,
          email: loginData.user.email,
          full_name: 'Rafael Admin',
          role: 'admin'
        })
        .select();
        
      if (insertError) {
        console.log('❌ Erro na inserção:', insertError.message);
      } else {
        console.log('✅ Profile criado com inserção simples!');
      }
    } else {
      console.log('✅ Profile admin criado/atualizado!');
      console.log('📋 Profile:', profile);
    }
    
    // Verificar se profile foi criado
    const { data: checkProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
      
    if (checkProfile) {
      console.log('🎯 Profile encontrado:');
      console.log(`   📧 Email: ${checkProfile.email}`);
      console.log(`   👤 Nome: ${checkProfile.full_name}`);
      console.log(`   🔑 Role: ${checkProfile.role}`);
      console.log('🚀 Pronto! Agora você pode acessar: http://localhost:8080/admin');
    } else {
      console.log('❌ Profile não foi criado');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

makeAdmin();
