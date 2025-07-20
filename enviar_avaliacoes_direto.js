import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function enviarAvaliacoesDireto() {
  console.log('🔍 AUDITORIA MANUAL - ENVIANDO AVALIAÇÕES DIRETO NO BANCO');
  console.log('====================================================');
  
  try {
    // 1. Buscar usuários para enviar avaliações
    console.log('\n📋 Buscando usuários...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .limit(4);
      
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      return;
    }
    
    console.log(`✅ ${users.length} usuários encontrados:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.full_name || user.email} (ID: ${user.id})`);
    });
    
    // 2. Buscar ferramentas para enviar avaliações
    console.log('\n🛠️ Buscando ferramentas...');
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('id, name, description, total_questions, estimated_time')
      .limit(4);
      
    if (toolsError) {
      console.error('❌ Erro ao buscar ferramentas:', toolsError);
      return;
    }
    
    console.log(`✅ ${tools.length} ferramentas encontradas:`);
    tools.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name} (ID: ${tool.id})`);
    });
    
    // 3. Criar avaliações para cada usuário
    console.log('\n📤 Enviando avaliações para cada usuário...');
    
    const now = new Date();
    const avaliacoes = [];
    
    // Para cada usuário, enviar uma avaliação com uma ferramenta diferente
    for (let i = 0; i < Math.min(users.length, tools.length); i++) {
      const user = users[i];
      const tool = tools[i];
      
      const dueDateOffset = (i + 1) * 7; // Cada avaliação tem um prazo diferente
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + dueDateOffset);
      
      avaliacoes.push({
        user_id: user.id,
        tool_id: tool.id,
        instructions: `Por favor, complete esta avaliação "${tool.name}" até ${dueDate.toLocaleDateString()}. Suas respostas são importantes para seu desenvolvimento.`,
        due_date: dueDate.toISOString(),
        status: 'pending',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      });
      
      console.log(`   ✓ Preparando avaliação: ${tool.name} para ${user.full_name || user.email}`);
    }
    
    // 4. Inserir avaliações no banco
    const { data: insertedAssessments, error: insertError } = await supabase
      .from('assessment_assignments')
      .insert(avaliacoes)
      .select();
      
    if (insertError) {
      console.error('❌ Erro ao inserir avaliações:', insertError);
      return;
    }
    
    console.log(`\n✅ ${insertedAssessments.length} avaliações enviadas com sucesso!`);
    
    // 5. Exibir detalhes das avaliações enviadas
    console.log('\n📊 DETALHES DAS AVALIAÇÕES ENVIADAS:');
    insertedAssessments.forEach((assessment, index) => {
      const user = users.find(u => u.id === assessment.user_id);
      const tool = tools.find(t => t.id === assessment.tool_id);
      
      console.log(`\n📝 Avaliação ${index + 1}:`);
      console.log(`   - ID: ${assessment.id}`);
      console.log(`   - Usuário: ${user?.full_name || user?.email || 'Desconhecido'}`);
      console.log(`   - Ferramenta: ${tool?.name || 'Desconhecida'}`);
      console.log(`   - Status: ${assessment.status}`);
      console.log(`   - Data limite: ${new Date(assessment.due_date).toLocaleDateString()}`);
    });
    
    console.log('\n🎯 AUDITORIA MANUAL CONCLUÍDA COM SUCESSO!');
    console.log('====================================================');
    console.log('✅ Avaliações enviadas diretamente no banco de dados');
    console.log('✅ Agora você pode verificar se elas aparecem na interface');
    console.log('✅ Teste o fluxo de resposta de avaliação como usuário');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar envio direto
enviarAvaliacoesDireto(); 