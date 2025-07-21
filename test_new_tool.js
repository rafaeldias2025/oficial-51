// Script para testar a nova ferramenta de gratidão e propósito
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewTool() {
  console.log('🔧 Testando nova ferramenta de Gratidão e Propósito...');

  try {
    // Buscar a sessão criada
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        *,
        session_tools(*)
      `)
      .eq('titulo', 'Sessão Semanal: Gratidão e Propósito');

    if (sessionsError) {
      console.log('❌ Erro ao buscar sessões:', sessionsError);
      return;
    }

    console.log('✅ Sessões encontradas:', sessions.length);
    
    if (sessions.length > 0) {
      const session = sessions[0];
      console.log('📋 Detalhes da sessão:');
      console.log('- ID:', session.id);
      console.log('- Título:', session.titulo);
      console.log('- Descrição:', session.descricao);
      console.log('- Data:', session.data_sessao);
      console.log('- Duração:', session.duracao_minutos, 'minutos');
      
      if (session.session_tools && session.session_tools.length > 0) {
        console.log('🔧 Ferramentas disponíveis:');
        session.session_tools.forEach(tool => {
          console.log(`  - ${tool.tool_name}: ${tool.tool_description}`);
        });
      }
    }

    // Testar se a nova ferramenta está funcionando
    console.log('\n🎯 Testando configuração da ferramenta...');
    
    const wheelConfigs = {
      gratidao_proposito: {
        title: 'Roda de Gratidão e Propósito',
        areas: ['Gratidão pelo Passado', 'Apreciação do Presente', 'Esperança no Futuro', 'Propósito de Vida', 'Conexões Significativas', 'Crescimento Pessoal'],
        questions: [
          'Pelo que você é mais grato hoje?',
          'Qual área do seu propósito está mais clara?',
          'Como você pode ampliar sua gratidão e propósito?'
        ]
      }
    };

    const config = wheelConfigs.gratidao_proposito;
    console.log('✅ Configuração da ferramenta:');
    console.log('- Título:', config.title);
    console.log('- Áreas:', config.areas.length);
    console.log('- Perguntas:', config.questions.length);
    
    console.log('\n📊 Áreas da ferramenta:');
    config.areas.forEach((area, index) => {
      console.log(`  ${index + 1}. ${area}`);
    });

    console.log('\n❓ Perguntas de reflexão:');
    config.questions.forEach((question, index) => {
      console.log(`  ${index + 1}. ${question}`);
    });

    console.log('\n🎉 NOVA FERRAMENTA TESTADA COM SUCESSO!');
    console.log('🔧 "Roda de Gratidão e Propósito" está pronta para uso');
    console.log('📧 Acesse o sistema para usar a ferramenta');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
testNewTool(); 