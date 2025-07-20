import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminProfile() {
  console.log('👑 Criando profile admin...');
  
  const adminData = {
    id: 'fe096bc3-d9a6-4720-b718-e4532e395335',
    email: 'rafael.ids@icloud.com',
    full_name: 'Rafael Admin',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  try {
    // Verificar se já existe
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminData.id)
      .single();
      
    if (existing) {
      console.log('👤 Profile já existe, atualizando para admin...');
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin', full_name: 'Rafael Admin' })
        .eq('id', adminData.id)
        .select();
        
      if (updateError) {
        console.log('❌ Erro ao atualizar:', updateError.message);
      } else {
        console.log('✅ Profile atualizado para admin!');
      }
    } else {
      console.log('👤 Criando novo profile admin...');
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert(adminData)
        .select();
        
      if (createError) {
        console.log('❌ Erro ao criar:', createError.message);
      } else {
        console.log('✅ Profile admin criado com sucesso!');
      }
    }
    
    // Verificar resultado final
    const { data: finalCheck } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'rafael.ids@icloud.com')
      .single();
      
    if (finalCheck) {
      console.log('🎯 Profile final:');
      console.log(`   📧 Email: ${finalCheck.email}`);
      console.log(`   👤 Nome: ${finalCheck.full_name}`);
      console.log(`   🔑 Role: ${finalCheck.role}`);
      console.log(`   🆔 ID: ${finalCheck.id}`);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createAdminProfile();
