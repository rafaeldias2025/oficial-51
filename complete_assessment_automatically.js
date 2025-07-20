import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function completeAssessmentAutomatically() {
  try {
    console.log('🤖 Completando avaliação automaticamente...');
    
    // 1. Verificar usuário Larissa
    console.log('\n👤 Verificando usuário Larissa...');
    const { data: larissa, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return;
    }
    
    console.log('✅ Usuário encontrado:', larissa.full_name);
    
    // 2. Verificar ferramenta
    console.log('\n🔧 Verificando ferramenta...');
    const { data: tool, error: toolError } = await supabase
      .from('coaching_tools')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (toolError) {
      console.error('❌ Erro ao buscar ferramenta:', toolError);
      return;
    }
    
    console.log('✅ Ferramenta encontrada:', tool.name);
    
    // 3. Verificar assignment
    console.log('\n📋 Verificando assignment...');
    const { data: assignment, error: assignmentError } = await supabase
      .from('assessment_assignments')
      .select('*')
      .eq('user_id', larissa.id)
      .eq('tool_id', 1)
      .single();
      
    if (assignmentError) {
      console.error('❌ Erro ao buscar assignment:', assignmentError);
      return;
    }
    
    console.log('✅ Assignment encontrado, status:', assignment.status);
    
    // 4. Gerar respostas realistas
    console.log('\n📝 Gerando respostas realistas...');
    
    const questions = tool.question_data;
    const answers = {};
    
    // Respostas realistas para cada categoria
    const realisticAnswers = {
      "Neurológico": 7,      // Boa saúde mental
      "Emocional": 6,        // Estável emocionalmente
      "Cardiovascular": 8,   // Boa saúde cardíaca
      "Visual": 7,           // Visão boa
      "Auditivo": 8,         // Audição boa
      "Respiratório": 8,     // Respiração boa
      "Vocal": 7,            // Voz boa
      "Pulmonar": 8,         // Pulmões saudáveis
      "Digestivo": 6,        // Digestão regular
      "Hepático": 7,         // Fígado saudável
      "Renal": 8,            // Rins saudáveis
      "Muscular": 7,         // Músculos bons
      "Ósseo": 8,            // Ossos saudáveis
      "Imunológico": 7,      // Sistema imune bom
      "Endócrino": 6,        // Hormônios regulares
    };
    
    questions.forEach((question, index) => {
      const category = question.category;
      const baseScore = realisticAnswers[category] || 7;
      
      // Adicionar variação realista (±1 ponto)
      const variation = Math.random() > 0.5 ? 1 : -1;
      const finalScore = Math.max(1, Math.min(10, baseScore + variation));
      
      answers[question.number] = finalScore;
      
      console.log(`   ${question.number}. ${question.text} (${category}): ${finalScore}/10`);
    });
    
    // 5. Calcular pontuação
    console.log('\n📊 Calculando pontuação...');
    const scores = Object.values(answers);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    console.log('✅ Pontuação calculada:');
    console.log(`   - Pontuação média: ${averageScore.toFixed(2)}/10`);
    console.log(`   - Pontuação mínima: ${Math.min(...scores)}/10`);
    console.log(`   - Pontuação máxima: ${Math.max(...scores)}/10`);
    
    // 6. Salvar resultado
    console.log('\n💾 Salvando resultado...');
    const { data: result, error: resultError } = await supabase
      .from('assessment_results')
      .insert({
        user_id: larissa.id,
        tool_id: 1,
        score: averageScore,
        results_data: {
          answers,
          averageScore,
          categoryScores: realisticAnswers,
          completedAt: new Date().toISOString()
        }
      })
      .select('id')
      .single();
      
    if (resultError) {
      console.error('❌ Erro ao salvar resultado:', resultError);
      return;
    }
    
    console.log('✅ Resultado salvo com sucesso!');
    console.log(`   - ID do resultado: ${result.id}`);
    
    // 7. Atualizar assignment como concluído
    console.log('\n✅ Atualizando assignment como concluído...');
    const { error: updateError } = await supabase
      .from('assessment_assignments')
      .update({
        status: 'completed',
        result_id: result.id,
        completed_at: new Date().toISOString()
      })
      .eq('id', assignment.id);
      
    if (updateError) {
      console.error('❌ Erro ao atualizar assignment:', updateError);
      return;
    }
    
    console.log('✅ Assignment atualizado com sucesso!');
    
    // 8. Verificar resultado final
    console.log('\n🔍 Verificando resultado final...');
    const { data: finalAssignment, error: finalError } = await supabase
      .from('assessment_assignments')
      .select(`
        *,
        assessment_results:result_id (*)
      `)
      .eq('id', assignment.id)
      .single();
      
    if (finalError) {
      console.error('❌ Erro ao verificar resultado final:', finalError);
      return;
    }
    
    console.log('✅ Resultado final:');
    console.log(`   - Status: ${finalAssignment.status}`);
    console.log(`   - Pontuação: ${finalAssignment.assessment_results?.score}`);
    console.log(`   - Concluído em: ${finalAssignment.completed_at}`);
    
    // 9. Gerar links
    console.log('\n🔗 Links gerados:');
    console.log(`   - Resultados: http://localhost:8082/assessment/results/${result.id}`);
    console.log(`   - Dashboard: http://localhost:8082/dashboard`);
    
    console.log('\n🎉 Avaliação completada automaticamente com sucesso!');
    console.log('📊 Resumo da avaliação da Larissa:');
    console.log(`   - Ferramenta: ${tool.name}`);
    console.log(`   - Pontuação geral: ${averageScore.toFixed(1)}/10`);
    console.log(`   - Status: Concluída`);
    console.log(`   - Usuário: ${larissa.full_name}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar a conclusão automática
completeAssessmentAutomatically(); 