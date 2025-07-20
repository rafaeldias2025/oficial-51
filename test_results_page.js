import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testResultsPage() {
  try {
    console.log('🧪 Testando página de resultados...');
    
    // 1. Verificar resultado existente
    console.log('\n📊 Verificando resultado...');
    const { data: result, error: resultError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (resultError) {
      console.error('❌ Erro ao buscar resultado:', resultError);
      return;
    }
    
    console.log('✅ Resultado encontrado:');
    console.log(`   - ID: ${result.id}`);
    console.log(`   - Usuário: ${result.user_id}`);
    console.log(`   - Ferramenta: ${result.tool_id}`);
    console.log(`   - Pontuação: ${result.score}`);
    
    // 2. Verificar ferramenta
    console.log('\n🔧 Verificando ferramenta...');
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .select('*')
      .eq('id', result.tool_id)
      .single();
      
    if (toolError) {
      console.error('❌ Erro ao buscar ferramenta:', toolError);
      return;
    }
    
    console.log('✅ Ferramenta encontrada:', tool.name);
    
    // 3. Verificar dados dos resultados
    console.log('\n📋 Verificando dados dos resultados...');
    const resultsData = result.results_data;
    
    console.log('📊 Pontuação geral:', resultsData.overallScore);
    console.log('📋 Pontuações por categoria:', resultsData.categoryScores);
    console.log('📝 Número de respostas:', resultsData.responses.length);
    
    // 4. Verificar atribuição
    console.log('\n📋 Verificando atribuição...');
    const { data: assignment, error: assignmentError } = await supabase
      .from('assessment_assignments')
      .select('*')
      .eq('result_id', result.id)
      .single();
      
    if (assignmentError) {
      console.error('❌ Erro ao buscar atribuição:', assignmentError);
    } else {
      console.log('✅ Atribuição encontrada:');
      console.log(`   - Status: ${assignment.status}`);
      console.log(`   - Concluído em: ${assignment.completed_at}`);
    }
    
    // 5. Verificar usuário
    console.log('\n👤 Verificando usuário...');
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', result.user_id)
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
    } else {
      console.log('✅ Usuário encontrado:');
      console.log(`   - Nome: ${user.full_name}`);
      console.log(`   - Email: ${user.email}`);
    }
    
    // 6. Simular dados para a página de resultados
    console.log('\n🎨 Simulando dados para a página de resultados...');
    
    // Processar dados da ferramenta
    let questions;
    if (typeof tool.question_data === 'string') {
      questions = JSON.parse(tool.question_data);
    } else {
      questions = tool.question_data;
    }
    
    // Agrupar perguntas por categoria
    const questionsByCategory = {};
    questions.forEach(q => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = [];
      }
      questionsByCategory[q.category].push({
        id: `q_${q.number}`,
        text: q.text,
        type: q.type,
        category: q.category,
        min: q.min,
        max: q.max
      });
    });
    
    // Criar seções
    const sections = Object.keys(questionsByCategory).map((category, index) => ({
      id: `section_${index}`,
      title: category,
      description: `Perguntas sobre ${category.toLowerCase()}`,
      icon: getIconForCategory(category),
      questions: questionsByCategory[category],
      color: getColorForIndex(index)
    }));
    
    // Criar objeto da ferramenta
    const assessmentTool = {
      id: tool.id,
      name: tool.name,
      description: tool.description || '',
      sections: sections,
      totalQuestions: tool.total_questions,
      estimatedTime: tool.estimated_time || 15
    };
    
    console.log('✅ Dados processados:');
    console.log(`   - Nome da ferramenta: ${assessmentTool.name}`);
    console.log(`   - Número de seções: ${assessmentTool.sections.length}`);
    console.log(`   - Total de perguntas: ${assessmentTool.totalQuestions}`);
    
    // 7. Gerar links
    console.log('\n🔗 Links gerados:');
    console.log(`   - Resultados: http://localhost:8081/assessment/results/${result.id}`);
    console.log(`   - Avaliação: http://localhost:8081/assessment/${tool.id}?assignment=${assignment?.id || 'none'}`);
    
    console.log('\n🎉 Teste da página de resultados concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Função para obter ícone baseado na categoria
function getIconForCategory(category) {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('emocion')) return 'emotions';
  if (lowerCategory.includes('mente') || lowerCategory.includes('cogn')) return 'brain';
  if (lowerCategory.includes('corpo') || lowerCategory.includes('fisio')) return 'body';
  if (lowerCategory.includes('social') || lowerCategory.includes('relac')) return 'people';
  if (lowerCategory.includes('espirit')) return 'spirit';
  if (lowerCategory.includes('financ') || lowerCategory.includes('dinheiro')) return 'money';
  if (lowerCategory.includes('saúde') || lowerCategory.includes('health')) return 'health';
  if (lowerCategory.includes('sono') || lowerCategory.includes('sleep')) return 'sleep';
  if (lowerCategory.includes('coração') || lowerCategory.includes('heart')) return 'heart';
  
  return 'default';
}

// Função para obter cor baseada no índice
function getColorForIndex(index) {
  const colors = [
    'hsl(142, 76%, 36%)', // Verde
    'hsl(217, 91%, 60%)', // Azul
    'hsl(41, 96%, 58%)',  // Amarelo
    'hsl(0, 84%, 60%)',   // Vermelho
    'hsl(262, 80%, 58%)', // Roxo
    'hsl(180, 77%, 47%)', // Ciano
    'hsl(24, 90%, 58%)',  // Laranja
    'hsl(316, 73%, 52%)', // Rosa
    'hsl(160, 84%, 39%)', // Verde esmeralda
    'hsl(230, 76%, 59%)'  // Azul royal
  ];
  
  return colors[index % colors.length];
}

// Executar o teste
testResultsPage(); 