// Script para testar o login do usuário admin
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('🔧 Testando login do usuário admin...');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@instituto.com',
      password: 'admin123'
    });

    if (error) {
      console.log('❌ Erro no login:', error);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Session:', data.session ? '✅ Ativa' : '❌ Inativa');

    // Testar se o usuário tem perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      console.log('❌ Erro ao buscar perfil:', profileError);
    } else {
      console.log('✅ Perfil encontrado:', profile);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testLogin(); 