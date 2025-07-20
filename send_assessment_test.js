import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendAssessmentTest() {
  try {
    console.log('🚀 Iniciando teste de envio de avaliação...');
    
    // 1. Verificar usuários disponíveis
    console.log('\n📋 Verificando usuários disponíveis...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .limit(5);
      
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      return;
    }
    
    console.log('✅ Usuários encontrados:', users.length);
    users.forEach(user => {
      console.log(`   - ${user.full_name || 'Sem nome'} (${user.email})`);
    });
    
    // 2. Verificar ferramentas disponíveis
    console.log('\n🔧 Verificando ferramentas disponíveis...');
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('id, name, description, total_questions')
      .limit(5);
      
    if (toolsError) {
      console.error('❌ Erro ao buscar ferramentas:', toolsError);
      return;
    }
    
    console.log('✅ Ferramentas encontradas:', tools.length);
    tools.forEach(tool => {
      console.log(`   - ${tool.name} (${tool.total_questions} perguntas)`);
    });
    
    // 3. Enviar avaliação para o primeiro usuário
    if (users.length > 0 && tools.length > 0) {
      const selectedUser = users[0];
      const selectedTool = tools[0];
      
      console.log(`\n📤 Enviando avaliação "${selectedTool.name}" para ${selectedUser.full_name || selectedUser.email}...`);
      
      const assignment = {
        user_id: selectedUser.id,
        tool_id: selectedTool.id,
        status: 'pending',
        instructions: 'Esta é uma avaliação de teste. Por favor, responda todas as perguntas com atenção.',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assessment_assignments')
        .insert([assignment])
        .select();
        
      if (assignmentError) {
        console.error('❌ Erro ao enviar avaliação:', assignmentError);
        return;
      }
      
      console.log('✅ Avaliação enviada com sucesso!');
      console.log('📊 Detalhes da atribuição:', assignmentData[0]);
      
      // 4. Verificar se a atribuição foi criada
      console.log('\n🔍 Verificando atribuição criada...');
      const { data: checkAssignment, error: checkError } = await supabase
        .from('assessment_assignments')
        .select(`
          *,
          profiles:user_id (full_name, email),
          coaching_tools:tool_id (name)
        `)
        .eq('id', assignmentData[0].id)
        .single();
        
      if (checkError) {
        console.error('❌ Erro ao verificar atribuição:', checkError);
        return;
      }
      
      console.log('✅ Atribuição verificada:');
      console.log(`   - Usuário: ${checkAssignment.profiles?.full_name || checkAssignment.profiles?.email}`);
      console.log(`   - Ferramenta: ${checkAssignment.coaching_tools?.name}`);
      console.log(`   - Status: ${checkAssignment.status}`);
      console.log(`   - Data limite: ${checkAssignment.due_date}`);
      
      // 5. Gerar link para a avaliação
      const assessmentUrl = `http://localhost:8081/assessment/${selectedTool.id}?assignment=${assignmentData[0].id}`;
      console.log(`\n🔗 Link para a avaliação: ${assessmentUrl}`);
      
    } else {
      console.log('❌ Não há usuários ou ferramentas disponíveis para o teste');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
sendAssessmentTest(); 