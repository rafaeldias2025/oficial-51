import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendAssessmentToLarissa() {
  try {
    console.log('📤 Enviando avaliação para Larissa Barbosa...');
    
    // 1. Verificar usuário Larissa
    console.log('\n👤 Verificando usuário Larissa...');
    const { data: larissa, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();
      
    if (userError) {
      console.error('❌ Erro ao buscar usuário Larissa:', userError);
      return;
    }
    
    console.log('✅ Usuário Larissa encontrado:');
    console.log(`   - ID: ${larissa.id}`);
    console.log(`   - Nome: ${larissa.full_name}`);
    console.log(`   - Email: ${larissa.email}`);
    
    // 2. Verificar ferramenta Roda da Saúde Galileu (ID 1)
    console.log('\n🔧 Verificando ferramenta Roda da Saúde Galileu...');
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
    
    // 3. Enviar avaliação para Larissa
    console.log('\n📤 Enviando avaliação...');
    
    const assignment = {
      user_id: larissa.id,
      tool_id: tool.id,
      status: 'pending',
      instructions: 'Olá Larissa! Esta é sua avaliação da Roda da Saúde Galileu. Por favor, responda todas as perguntas com atenção para obter um diagnóstico completo dos seus 16 sistemas de saúde.',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: assignmentData, error: assignmentError } = await supabase
      .from('assessment_assignments')
      .insert([assignment])
      .select('*')
      .single();
      
    if (assignmentError) {
      console.error('❌ Erro ao enviar avaliação:', assignmentError);
      return;
    }
    
    console.log('✅ Avaliação enviada com sucesso!');
    console.log('📊 Detalhes da atribuição:');
    console.log(`   - ID: ${assignmentData.id}`);
    console.log(`   - Status: ${assignmentData.status}`);
    console.log(`   - Data limite: ${assignmentData.due_date}`);
    console.log(`   - Instruções: ${assignmentData.instructions}`);
    
    // 4. Verificar atribuição criada
    console.log('\n🔍 Verificando atribuição criada...');
    const { data: checkAssignment, error: checkError } = await supabase
      .from('assessment_assignments')
      .select(`
        *,
        profiles:user_id (full_name, email),
        coaching_tools:tool_id (name)
      `)
      .eq('id', assignmentData.id)
      .single();
      
    if (checkError) {
      console.error('❌ Erro ao verificar atribuição:', checkError);
      return;
    }
    
    console.log('✅ Atribuição verificada:');
    console.log(`   - Usuário: ${checkAssignment.profiles?.full_name}`);
    console.log(`   - Email: ${checkAssignment.profiles?.email}`);
    console.log(`   - Ferramenta: ${checkAssignment.coaching_tools?.name}`);
    console.log(`   - Status: ${checkAssignment.status}`);
    
    // 5. Gerar links
    console.log('\n🔗 Links gerados:');
    console.log(`   - Avaliação: http://localhost:8081/assessment/${tool.id}?assignment=${assignmentData.id}`);
    console.log(`   - Painel do usuário: http://localhost:8081/dashboard`);
    
    console.log('\n📧 Informações para Larissa:');
    console.log('   - Email: larissa@institutodossonhos.com');
    console.log('   - Senha: 10203040');
    console.log('   - Avaliação: Roda da Saúde Galileu');
    console.log('   - Data limite: 7 dias');
    
    console.log('\n🎉 Avaliação enviada para Larissa Barbosa com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o envio
sendAssessmentToLarissa(); 