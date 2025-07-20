import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceLoadTools() {
  console.log('🔧 FORÇANDO CARREGAMENTO DAS FERRAMENTAS');
  console.log('==========================================');
  
  try {
    // Limpar ferramentas existentes e inserir novas
    console.log('🗑️ Limpando ferramentas existentes...');
    
    const { error: deleteError } = await supabase
      .from('coaching_tools')
      .delete()
      .neq('id', 0); // Deletar todas
      
    if (deleteError) {
      console.error('❌ Erro ao limpar ferramentas:', deleteError);
    } else {
      console.log('✅ Ferramentas antigas removidas');
    }
    
    // Inserir ferramentas novas e limpas
    const newTools = [
      {
        name: 'Avaliação de Metas e Objetivos',
        description: 'Avaliação completa para definir e acompanhar metas pessoais e profissionais',
        total_questions: 15,
        estimated_time: 20,
        category: 'planejamento',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Avaliação de Bem-estar Emocional',
        description: 'Questionário para avaliar saúde mental e equilíbrio emocional',
        total_questions: 12,
        estimated_time: 15,
        category: 'saude_mental',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Avaliação de Produtividade',
        description: 'Diagnóstico de hábitos e rotinas para melhorar produtividade',
        total_questions: 18,
        estimated_time: 25,
        category: 'produtividade',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Avaliação de Relacionamentos',
        description: 'Análise de relacionamentos pessoais e profissionais',
        total_questions: 10,
        estimated_time: 12,
        category: 'relacionamentos',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    console.log('📤 Inserindo novas ferramentas...');
    
    const { data: insertedTools, error: insertError } = await supabase
      .from('coaching_tools')
      .insert(newTools)
      .select();
      
    if (insertError) {
      console.error('❌ Erro ao inserir ferramentas:', insertError);
      return;
    }
    
    console.log('✅ Ferramentas inseridas com sucesso!');
    insertedTools.forEach(tool => {
      console.log(`   - ${tool.name} (ID: ${tool.id})`);
    });
    
    console.log('\n🎯 FERRAMENTAS PRONTAS PARA AUDITORIA!');
    console.log('==========================================');
    console.log('✅ 4 ferramentas inseridas no banco');
    console.log('✅ Dados limpos e organizados');
    console.log('✅ Frontend deve carregar corretamente');
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('1. Recarregar a página do admin');
    console.log('2. Ir para Avaliações > Enviar Nova Avaliação');
    console.log('3. Clicar no dropdown de ferramentas');
    console.log('4. Verificar se as 4 ferramentas aparecem');
    console.log('5. Selecionar uma ferramenta');
    console.log('6. Selecionar 4 usuários');
    console.log('7. Clicar "Enviar avaliação"');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar força carregamento
forceLoadTools(); 