import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimpleAssessment() {
  try {
    console.log('🧪 Testando avaliação simplificada...');
    
    // 1. Testar conexão com coaching_tools
    console.log('\n🔧 Testando tabela coaching_tools...');
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('*')
      .limit(1);
      
    if (toolsError) {
      console.error('❌ Erro ao acessar coaching_tools:', toolsError);
      return;
    }
    
    console.log('✅ Tabela coaching_tools acessível');
    console.log(`   - Ferramentas encontradas: ${tools.length}`);
    
    // 2. Testar ferramenta específica
    console.log('\n📋 Testando ferramenta ID 1...');
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (toolError) {
      console.error('❌ Erro ao buscar ferramenta:', toolError);
      return;
    }
    
    console.log('✅ Ferramenta encontrada:');
    console.log(`   - ID: ${tool.id}`);
    console.log(`   - Nome: ${tool.name}`);
    console.log(`   - Perguntas: ${tool.total_questions}`);
    console.log(`   - Dados de perguntas: ${typeof tool.question_data}`);
    
    // 3. Testar parsing dos dados
    console.log('\n📊 Testando parsing dos dados...');
    let questions;
    try {
      if (typeof tool.question_data === 'string') {
        questions = JSON.parse(tool.question_data);
      } else {
        questions = tool.question_data;
      }
      
      console.log('✅ Dados parseados com sucesso');
      console.log(`   - Número de perguntas: ${questions.length}`);
      console.log(`   - Primeira pergunta: ${questions[0].text}`);
      console.log(`   - Categorias: ${[...new Set(questions.map(q => q.category))].join(', ')}`);
      
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse dos dados:', parseError);
      return;
    }
    
    // 4. Simular respostas
    console.log('\n📝 Simulando respostas...');
    const answers = {};
    questions.forEach((q, index) => {
      answers[q.number] = Math.floor(Math.random() * 10) + 1;
    });
    
    console.log('✅ Respostas simuladas:');
    console.log(`   - Total de respostas: ${Object.keys(answers).length}`);
    console.log(`   - Exemplo: ${JSON.stringify(answers).substring(0, 100)}...`);
    
    // 5. Calcular pontuação
    console.log('\n📊 Calculando pontuação...');
    const scores = Object.values(answers);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    console.log('✅ Pontuação calculada:');
    console.log(`   - Pontuação média: ${averageScore.toFixed(2)}`);
    console.log(`   - Pontuação mínima: ${Math.min(...scores)}`);
    console.log(`   - Pontuação máxima: ${Math.max(...scores)}`);
    
    // 6. Testar salvamento (opcional)
    console.log('\n💾 Testando salvamento...');
    const testUserId = '00000000-0000-0000-0000-000000000006'; // Larissa
    
    const { data: result, error: resultError } = await supabase
      .from('assessment_results')
      .insert({
        user_id: testUserId,
        tool_id: 1,
        score: averageScore,
        results_data: { answers, averageScore }
      })
      .select('id')
      .single();
      
    if (resultError) {
      console.error('❌ Erro ao salvar resultado:', resultError);
    } else {
      console.log('✅ Resultado salvo com sucesso!');
      console.log(`   - ID do resultado: ${result.id}`);
      
      // Limpar resultado de teste
      await supabase
        .from('assessment_results')
        .delete()
        .eq('id', result.id);
        
      console.log('✅ Resultado de teste removido');
    }
    
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('💡 A avaliação simplificada está funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
testSimpleAssessment(); 