import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSessionsTools() {
  console.log('🔍 Verificando ferramentas nas sessões...');
  
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*');
      
    if (error) {
      console.log('❌ Erro:', error.message);
      return;
    }
    
    console.log(`📊 Total de sessões: ${sessions.length}`);
    
    sessions.forEach((session, index) => {
      console.log(`\n📝 Sessão ${index + 1}:`);
      console.log(`   📋 Título: ${session.title}`);
      console.log(`   📄 Descrição: ${session.description}`);
      console.log(`   🎯 Categoria: ${session.category}`);
      console.log(`   ⏱️ Tempo estimado: ${session.estimated_time || 'Não definido'}`);
      
      if (session.wheel_tools) {
        console.log(`   🎡 Wheel Tools: ${JSON.stringify(session.wheel_tools)}`);
      }
      
      if (session.available_tools) {
        console.log(`   🛠️ Available Tools: ${JSON.stringify(session.available_tools)}`);
      }
      
      if (session.content) {
        const contentPreview = session.content.substring(0, 100) + '...';
        console.log(`   📖 Conteúdo: ${contentPreview}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkSessionsTools();
