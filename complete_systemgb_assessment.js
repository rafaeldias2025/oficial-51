import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function completeSystemGBAssessment() {
  try {
    console.log('🤖 Completando avaliação SistemaGB automaticamente...');
    
    // 1. Verificar usuário Larissa
    console.log('\n👤 Verificando usuário Larissa...');
    const { data: larissa, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissabarbosa@gmail.com')
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return;
    }
    
    console.log('✅ Usuário encontrado:', larissa.full_name);
    
    // 2. Verificar ferramenta SistemaGB
    console.log('\n🔧 Verificando ferramenta SistemaGB...');
    const { data: systemGB, error: toolError } = await supabase
      .from('coaching_tools')
      .select('*')
      .eq('id', 2)
      .single();
      
    if (toolError) {
      console.error('❌ Erro ao buscar ferramenta:', toolError);
      return;
    }
    
    console.log('✅ Ferramenta encontrada:', systemGB.name);
    
    // 3. Verificar assignment
    console.log('\n📋 Verificando assignment...');
    const { data: assignment, error: assignmentError } = await supabase
      .from('assessment_assignments')
      .select('*')
      .eq('user_id', larissa.id)
      .eq('tool_id', 2)
      .eq('status', 'pending')
      .single();
      
    if (assignmentError) {
      console.error('❌ Erro ao buscar assignment:', assignmentError);
      return;
    }
    
    console.log('✅ Assignment encontrado, status:', assignment.status);
    
    // 4. Gerar respostas realistas para SistemaGB
    console.log('\n📝 Gerando respostas realistas para SistemaGB...');
    
    const questions = systemGB.question_data;
    const answers = {};
    
    // Respostas realistas para SistemaGB (bem-estar e qualidade de vida)
    const realisticAnswers = {
      "Fisiológico": 7,      // Boa saúde física
      "Emocional": 6,        // Estável emocionalmente
      "Mental": 7,           // Boa saúde mental
      "Social": 8,           // Boas relações sociais
      "Espiritual": 6,       // Equilíbrio espiritual
      "Financeiro": 7,       // Boa situação financeira
      "Profissional": 8,     // Satisfação profissional
      "Ambiental": 7,        // Ambiente saudável
      "Intelectual": 8,      // Desenvolvimento intelectual
      "Recreativo": 7,       // Tempo de lazer
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
        tool_id: 2,
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
    
    // 9. Verificar todas as avaliações da Larissa
    console.log('\n📊 Verificando todas as avaliações da Larissa...');
    const { data: allAssignments, error: allError } = await supabase
      .from('assessment_assignments')
      .select(`
        *,
        coaching_tools:tool_id (name),
        assessment_results:result_id (score)
      `)
      .eq('user_id', larissa.id)
      .order('created_at', { ascending: false });
      
    if (allError) {
      console.error('❌ Erro ao buscar todas as avaliações:', allError);
    } else {
      console.log('✅ Todas as avaliações da Larissa:');
      allAssignments.forEach((assignment, index) => {
        console.log(`   ${index + 1}. ${assignment.coaching_tools.name} - ${assignment.status} - ${assignment.assessment_results?.score || 'N/A'}/10`);
      });
    }
    
    // 10. Gerar links
    console.log('\n🔗 Links gerados:');
    console.log(`   - Resultados SistemaGB: http://localhost:8082/assessment/results/${result.id}`);
    console.log(`   - Dashboard Larissa: http://localhost:8082/dashboard`);
    
    console.log('\n🎉 Avaliação SistemaGB completada automaticamente com sucesso!');
    console.log('📊 Resumo da avaliação SistemaGB da Larissa:');
    console.log(`   - Ferramenta: ${systemGB.name}`);
    console.log(`   - Pontuação geral: ${averageScore.toFixed(1)}/10`);
    console.log(`   - Status: Concluída`);
    console.log(`   - Usuário: ${larissa.full_name}`);
    console.log(`   - Total de avaliações: ${allAssignments?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar a conclusão automática
completeSystemGBAssessment(); 