import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAssessmentDirect() {
  try {
    console.log('🧪 Testando avaliação diretamente...');
    
    // 1. Verificar ferramenta
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
    
    console.log('✅ Ferramenta encontrada:');
    console.log(`   - ID: ${tool.id}`);
    console.log(`   - Nome: ${tool.name}`);
    console.log(`   - Perguntas: ${tool.total_questions}`);
    console.log(`   - Dados: ${JSON.stringify(tool.question_data).substring(0, 100)}...`);
    
    // 2. Verificar usuário Larissa
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
    
    console.log('✅ Usuário encontrado:');
    console.log(`   - ID: ${larissa.id}`);
    console.log(`   - Nome: ${larissa.full_name}`);
    
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
    
    console.log('✅ Assignment encontrado:');
    console.log(`   - ID: ${assignment.id}`);
    console.log(`   - Status: ${assignment.status}`);
    console.log(`   - User ID: ${assignment.user_id}`);
    console.log(`   - Tool ID: ${assignment.tool_id}`);
    
    // 4. Testar acesso direto
    console.log('\n🔗 Links para teste:');
    console.log(`   - Com assignment: http://localhost:8082/assessment/1?assignment=${assignment.id}`);
    console.log(`   - Sem assignment: http://localhost:8082/assessment/1`);
    
    // 5. Verificar se há problemas de permissão
    console.log('\n🔐 Verificando permissões...');
    
    // Testar se o usuário pode acessar a ferramenta
    const canAccess = assignment && assignment.user_id === larissa.id;
    console.log(`   - Pode acessar: ${canAccess}`);
    console.log(`   - Assignment pertence ao usuário: ${assignment.user_id === larissa.id}`);
    console.log(`   - Status válido: ${['pending', 'completed'].includes(assignment.status)}`);
    
    // 6. Simular dados que o frontend espera
    console.log('\n📊 Dados esperados pelo frontend:');
    const expectedData = {
      toolId: '1',
      userId: larissa.id,
      assignmentId: assignment.id,
      toolName: tool.name,
      questions: tool.question_data
    };
    
    console.log('   - Dados válidos:', JSON.stringify(expectedData, null, 2));
    
    console.log('\n🎉 Teste concluído!');
    console.log('💡 Se ainda houver erro, pode ser um problema no frontend ou na autenticação.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
testAssessmentDirect(); 