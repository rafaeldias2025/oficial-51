import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendNewAssessmentToLarissa() {
  try {
    console.log('📤 Enviando nova avaliação para Larissa...');
    
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
    
    // 2. Verificar ferramentas disponíveis
    console.log('\n🔧 Verificando ferramentas disponíveis...');
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('*')
      .order('id', { ascending: true });
      
    if (toolsError) {
      console.error('❌ Erro ao buscar ferramentas:', toolsError);
      return;
    }
    
    console.log('✅ Ferramentas encontradas:');
    tools.forEach(tool => {
      console.log(`   - ID ${tool.id}: ${tool.name} (${tool.total_questions} perguntas)`);
    });
    
    // 3. Enviar SistemaGB (ID 2) para Larissa
    console.log('\n📋 Enviando SistemaGB para Larissa...');
    const { data: assignment, error: assignmentError } = await supabase
      .from('assessment_assignments')
      .insert({
        user_id: larissa.id,
        tool_id: 2, // SistemaGB
        status: 'pending',
        instructions: 'Olá Larissa! Esta é sua nova avaliação do SistemaGB. Por favor, responda todas as perguntas com atenção para obter um diagnóstico completo do seu bem-estar e qualidade de vida.',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
      })
      .select('*')
      .single();
      
    if (assignmentError) {
      console.error('❌ Erro ao enviar avaliação:', assignmentError);
      return;
    }
    
    console.log('✅ Avaliação enviada com sucesso!');
    console.log(`   - ID do assignment: ${assignment.id}`);
    console.log(`   - Ferramenta: SistemaGB`);
    console.log(`   - Status: ${assignment.status}`);
    console.log(`   - Data limite: ${assignment.due_date}`);
    
    // 4. Verificar ferramenta SistemaGB
    console.log('\n📊 Verificando detalhes da ferramenta SistemaGB...');
    const { data: systemGB, error: toolError } = await supabase
      .from('coaching_tools')
      .select('*')
      .eq('id', 2)
      .single();
      
    if (toolError) {
      console.error('❌ Erro ao buscar ferramenta:', toolError);
      return;
    }
    
    console.log('✅ Detalhes da ferramenta:');
    console.log(`   - Nome: ${systemGB.name}`);
    console.log(`   - Descrição: ${systemGB.description}`);
    console.log(`   - Perguntas: ${systemGB.total_questions}`);
    console.log(`   - Tempo estimado: ${systemGB.estimated_time} minutos`);
    
    // 5. Mostrar algumas perguntas
    if (systemGB.question_data) {
      console.log('\n📝 Exemplo de perguntas:');
      const questions = systemGB.question_data;
      questions.slice(0, 5).forEach((q, index) => {
        console.log(`   ${index + 1}. ${q.text} (${q.category})`);
      });
      console.log(`   ... e mais ${questions.length - 5} perguntas`);
    }
    
    // 6. Gerar links
    console.log('\n🔗 Links para teste:');
    console.log(`   - Avaliação: http://localhost:8082/assessment/simple/2?assignment=${assignment.id}`);
    console.log(`   - Dashboard Larissa: http://localhost:8082/dashboard`);
    
    console.log('\n🎉 Nova avaliação enviada com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - Usuário: ${larissa.full_name}`);
    console.log(`   - Ferramenta: ${systemGB.name}`);
    console.log(`   - Perguntas: ${systemGB.total_questions}`);
    console.log(`   - Status: Pendente`);
    console.log(`   - Assignment ID: ${assignment.id}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o envio
sendNewAssessmentToLarissa(); 