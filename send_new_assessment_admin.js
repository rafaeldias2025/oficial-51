import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendNewAssessmentAdmin() {
  try {
    console.log('📤 Admin enviando nova avaliação...');
    
    // 1. Buscar usuário Larissa
    console.log('\n👤 Buscando usuário Larissa...');
    const { data: larissa, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar Larissa:', userError);
      return;
    }
    
    console.log('✅ Larissa encontrada:', larissa.full_name);
    
    // 2. Buscar ferramentas disponíveis
    console.log('\n🔧 Buscando ferramentas disponíveis...');
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (toolsError) {
      console.error('❌ Erro ao buscar ferramentas:', toolsError);
      return;
    }
    
    console.log('✅ Ferramentas disponíveis:');
    tools.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name} - ${tool.category}`);
    });
    
    // 3. Selecionar uma ferramenta (vou usar a primeira)
    const selectedTool = tools[0];
    console.log(`\n📊 Selecionando ferramenta: ${selectedTool.name}`);
    
    // 4. Criar nova atribuição de avaliação (versão simplificada)
    console.log('\n📤 Criando nova atribuição de avaliação...');
    const newAssignment = {
      user_id: larissa.id,
      tool_id: selectedTool.id,
      status: 'pending'
    };
    
    const { data: assignment, error: assignmentError } = await supabase
      .from('assessment_assignments')
      .insert([newAssignment])
      .select();
      
    if (assignmentError) {
      console.error('❌ Erro ao criar atribuição:', assignmentError);
      return;
    }
    
    console.log('✅ Avaliação enviada com sucesso!');
    console.log(`   - ID da atribuição: ${assignment[0].id}`);
    console.log(`   - Ferramenta: ${selectedTool.name}`);
    console.log(`   - Usuário: ${larissa.full_name}`);
    console.log(`   - Status: ${assignment[0].status}`);
    
    // 5. Verificar todas as atribuições da Larissa
    console.log('\n📋 Verificando todas as atribuições da Larissa...');
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
      console.error('❌ Erro ao buscar atribuições:', allError);
    } else {
      console.log('✅ Todas as atribuições da Larissa:');
      allAssignments.forEach((assignment, index) => {
        console.log(`   ${index + 1}. ${assignment.coaching_tools.name} - ${assignment.status} - ${assignment.assessment_results?.score || 'N/A'}/10`);
      });
    }
    
    console.log('\n🎉 Nova avaliação enviada com sucesso!');
    console.log('💡 Agora a Larissa pode:');
    console.log('   1. Fazer login em: http://localhost:8082/dashboard');
    console.log('   2. Ir em "Avaliações" no menu lateral');
    console.log('   3. Ver a nova avaliação pendente');
    console.log('   4. Responder todas as perguntas');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar envio da avaliação
sendNewAssessmentAdmin(); 