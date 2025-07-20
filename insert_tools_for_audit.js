import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertToolsForAudit() {
  console.log('🔧 INSERINDO FERRAMENTAS PARA AUDITORIA');
  console.log('========================================');
  
  try {
    // Verificar ferramentas existentes
    const { data: existingTools, error: checkError } = await supabase
      .from('coaching_tools')
      .select('*');
      
    if (checkError) {
      console.error('❌ Erro ao verificar ferramentas:', checkError);
      return;
    }
    
    console.log(`📊 Ferramentas existentes: ${existingTools.length}`);
    
    if (existingTools.length > 0) {
      console.log('✅ Ferramentas já existem no banco');
      existingTools.forEach(tool => {
        console.log(`   - ${tool.name} (ID: ${tool.id})`);
      });
      return;
    }
    
    // Inserir ferramentas para auditoria
    const toolsToInsert = [
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
    
    const { data: insertedTools, error: insertError } = await supabase
      .from('coaching_tools')
      .insert(toolsToInsert)
      .select();
      
    if (insertError) {
      console.error('❌ Erro ao inserir ferramentas:', insertError);
      return;
    }
    
    console.log('✅ Ferramentas inseridas com sucesso!');
    insertedTools.forEach(tool => {
      console.log(`   - ${tool.name} (ID: ${tool.id})`);
    });
    
    console.log('\n🎯 AUDITORIA PRONTA!');
    console.log('Agora você pode continuar testando o sistema com ferramentas disponíveis.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar inserção
insertToolsForAudit(); 