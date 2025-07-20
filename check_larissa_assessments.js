import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLarissaAssessments() {
  try {
    console.log('🔍 Verificando avaliações da Larissa...');
    
    // 1. Verificar usuário Larissa
    console.log('\n👤 Verificando usuário Larissa...');
    const { data: larissa, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissabarbosa@gmail.com')
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar usuário Larissa:', userError);
      return;
    }
    
    console.log('✅ Usuário Larissa encontrado:');
    console.log(`   - ID: ${larissa.id}`);
    console.log(`   - Nome: ${larissa.full_name}`);
    console.log(`   - Email: ${larissa.email}`);
    
    // 2. Verificar avaliações da Larissa
    console.log('\n📋 Verificando avaliações...');
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessment_assignments')
      .select(`
        *,
        coaching_tools:tool_id (name, description, total_questions)
      `)
      .eq('user_id', larissa.id)
      .order('created_at', { ascending: false });
      
    if (assessmentError) {
      console.error('❌ Erro ao buscar avaliações:', assessmentError);
      return;
    }
    
    console.log(`✅ Encontradas ${assessments.length} avaliação(ões) para Larissa:`);
    
    assessments.forEach((assessment, index) => {
      console.log(`\n📊 Avaliação ${index + 1}:`);
      console.log(`   - ID: ${assessment.id}`);
      console.log(`   - Ferramenta: ${assessment.coaching_tools?.name}`);
      console.log(`   - Status: ${assessment.status}`);
      console.log(`   - Enviada em: ${assessment.created_at}`);
      console.log(`   - Data limite: ${assessment.due_date}`);
      console.log(`   - Instruções: ${assessment.instructions}`);
      
      if (assessment.status === 'completed') {
        console.log(`   - Concluída em: ${assessment.completed_at}`);
        console.log(`   - ID do resultado: ${assessment.result_id}`);
      }
    });
    
    // 3. Verificar resultados se houver
    const completedAssessments = assessments.filter(a => a.status === 'completed');
    if (completedAssessments.length > 0) {
      console.log('\n📊 Verificando resultados...');
      
      for (const assessment of completedAssessments) {
        const { data: result, error: resultError } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('id', assessment.result_id)
          .single();
          
        if (resultError) {
          console.error(`❌ Erro ao buscar resultado ${assessment.result_id}:`, resultError);
        } else {
          console.log(`✅ Resultado encontrado:`);
          console.log(`   - Pontuação: ${result.score}`);
          console.log(`   - Concluído em: ${result.created_at}`);
        }
      }
    }
    
    // 4. Gerar links para avaliações pendentes
    const pendingAssessments = assessments.filter(a => a.status === 'pending');
    if (pendingAssessments.length > 0) {
      console.log('\n🔗 Links para avaliações pendentes:');
      pendingAssessments.forEach(assessment => {
        console.log(`   - ${assessment.coaching_tools?.name}: http://localhost:8082/assessment/${assessment.tool_id}?assignment=${assessment.id}`);
      });
    }
    
    // 5. Resumo
    console.log('\n📈 Resumo das avaliações da Larissa:');
    console.log(`   - Total de avaliações: ${assessments.length}`);
    console.log(`   - Pendentes: ${assessments.filter(a => a.status === 'pending').length}`);
    console.log(`   - Concluídas: ${assessments.filter(a => a.status === 'completed').length}`);
    console.log(`   - Canceladas: ${assessments.filter(a => a.status === 'cancelled').length}`);
    
    console.log('\n🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar a verificação
checkLarissaAssessments(); 