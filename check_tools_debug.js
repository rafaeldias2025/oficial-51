import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkToolsDebug() {
  console.log('🔍 DEBUGANDO FERRAMENTAS');
  console.log('========================');
  
  try {
    // Verificar ferramentas no banco
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('*')
      .order('name', { ascending: true });
      
    if (toolsError) {
      console.error('❌ Erro ao buscar ferramentas:', toolsError);
      return;
    }
    
    console.log(`📊 Ferramentas no banco: ${tools.length}`);
    tools.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name} (ID: ${tool.id})`);
      console.log(`      - Descrição: ${tool.description || 'Sem descrição'}`);
      console.log(`      - Perguntas: ${tool.total_questions}`);
      console.log(`      - Tempo: ${tool.estimated_time} min`);
    });
    
    // Verificar se há ferramentas com dados válidos
    const validTools = tools.filter(tool => 
      tool.name && 
      tool.total_questions && 
      tool.estimated_time
    );
    
    console.log(`\n✅ Ferramentas válidas: ${validTools.length}`);
    
    if (validTools.length === 0) {
      console.log('❌ Nenhuma ferramenta válida encontrada!');
      console.log('💡 Vou inserir ferramentas de teste...');
      
      // Inserir ferramentas de teste
      const testTools = [
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
        .insert(testTools)
        .select();
        
      if (insertError) {
        console.error('❌ Erro ao inserir ferramentas:', insertError);
      } else {
        console.log('✅ Ferramentas de teste inseridas!');
        insertedTools.forEach(tool => {
          console.log(`   - ${tool.name} (ID: ${tool.id})`);
        });
      }
    }
    
    console.log('\n🎯 DEBUG CONCLUÍDO!');
    console.log('Agora você pode testar o dropdown no navegador.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar debug
checkToolsDebug(); 