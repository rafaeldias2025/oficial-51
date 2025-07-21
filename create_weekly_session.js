// Script para criar uma sessão semanal com a nova ferramenta
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createWeeklySession() {
  console.log('🔧 Criando sessão semanal com nova ferramenta...');

  try {
    // Buscar o usuário admin
    const { data: adminUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@instituto.com')
      .single();

    if (userError) {
      console.log('❌ Erro ao buscar usuário admin:', userError);
      return;
    }

    console.log('✅ Usuário admin encontrado:', adminUser.id);

    // Criar sessão semanal usando a estrutura correta da tabela
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: adminUser.id,
        titulo: 'Sessão Semanal: Gratidão e Propósito',
        descricao: 'Uma sessão especial para explorar sua gratidão e clareza de propósito',
        tipo_sessao: 'desenvolvimento_pessoal',
        duracao_minutos: 30,
        intensidade: 'moderada',
        calorias_estimadas: 0,
        data_sessao: new Date().toISOString().split('T')[0], // Hoje
        hora_inicio: '10:00:00',
        hora_fim: '10:30:00',
        concluida: false,
        observacoes: `Bem-vindo à sua sessão semanal de desenvolvimento pessoal!

Esta semana vamos focar na gratidão e no propósito. A ferramenta "Roda de Gratidão e Propósito" irá ajudá-lo a:

1. **Refletir sobre o passado** - O que você aprendeu e pelo que é grato
2. **Apreciar o presente** - Como você pode viver mais plenamente hoje
3. **Olhar para o futuro** - Que esperanças e sonhos você tem
4. **Clarificar seu propósito** - Qual é sua missão de vida
5. **Valorizar conexões** - Como estão seus relacionamentos importantes
6. **Avaliar crescimento** - Como você está se desenvolvendo

Instruções:
- Reserve 20-30 minutos para esta sessão
- Encontre um lugar tranquilo onde possa refletir
- Seja honesto consigo mesmo nas avaliações
- Anote suas reflexões no final

Lembre-se: A gratidão é o caminho para a felicidade, e o propósito é o que dá sentido à vida.`
      })
      .select()
      .single();

    if (sessionError) {
      console.log('❌ Erro ao criar sessão:', sessionError);
      return;
    }

    console.log('✅ Sessão criada com sucesso!');
    console.log('📋 Detalhes da sessão:');
    console.log('- Título:', sessionData.titulo);
    console.log('- ID:', sessionData.id);
    console.log('- Data:', sessionData.data_sessao);
    console.log('- Duração:', sessionData.duracao_minutos, 'minutos');

    // Agora vou criar uma entrada na tabela de ferramentas de sessão
    const { data: toolData, error: toolError } = await supabase
      .from('session_tools')
      .insert({
        session_id: sessionData.id,
        tool: 'gratidao_proposito',
        tool_name: 'Roda de Gratidão e Propósito',
        tool_description: 'Explore sua gratidão e clareza de propósito em 6 dimensões'
      })
      .select()
      .single();

    if (toolError) {
      console.log('⚠️ Erro ao criar ferramenta da sessão:', toolError);
    } else {
      console.log('✅ Ferramenta da sessão criada:', toolData);
    }

    console.log('\n🎉 SESSÃO SEMANAL CRIADA COM SUCESSO!');
    console.log('🔧 Nova ferramenta "Roda de Gratidão e Propósito" disponível');
    console.log('📧 Acesse o sistema para ver a sessão');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
createWeeklySession(); 