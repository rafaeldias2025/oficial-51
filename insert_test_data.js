// Script para inserir dados de teste para o sistema de ferramentas
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestData() {
  console.log('🚀 Inserindo dados de teste...');

  try {
    // 1. Verificar se a tabela user_tools existe
    console.log('📋 Verificando tabela user_tools...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_tools')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('❌ Tabela user_tools não existe. Execute a migração primeiro:');
      console.log('cd supabase && npx supabase migration up');
      return;
    }

    console.log('✅ Tabela user_tools existe!');

    // 2. Buscar usuários existentes
    console.log('👥 Buscando usuários...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .limit(5);

    if (usersError || !users || users.length === 0) {
      console.log('❌ Nenhum usuário encontrado. Crie usuários primeiro.');
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuários:`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // 3. Buscar ferramentas existentes
    console.log('🛠️ Buscando ferramentas...');
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('id, name, category')
      .limit(3);

    if (toolsError || !tools || tools.length === 0) {
      console.log('❌ Nenhuma ferramenta encontrada. Crie ferramentas primeiro.');
      return;
    }

    console.log(`✅ Encontradas ${tools.length} ferramentas:`);
    tools.forEach(tool => {
      console.log(`   - ${tool.name} (${tool.category})`);
    });

    // 4. Inserir dados de teste na tabela user_tools
    console.log('📤 Inserindo dados de teste...');
    
    const testAssignments = [];
    
    // Criar algumas atribuições de teste
    for (let i = 0; i < Math.min(users.length, 3); i++) {
      for (let j = 0; j < Math.min(tools.length, 2); j++) {
        testAssignments.push({
          user_id: users[i].id,
          tool_id: tools[j].id,
          assigned_by: users[0].id, // Primeiro usuário como admin
          status: i === 0 ? 'pending' : i === 1 ? 'in_progress' : 'completed',
          scheduled_date: null,
          custom_message: `Mensagem personalizada para ${users[i].name} sobre ${tools[j].name}`,
          email_sent: true,
          sms_sent: false,
          whatsapp_sent: true,
          is_active: true
        });
      }
    }

    const { data: insertedData, error: insertError } = await supabase
      .from('user_tools')
      .insert(testAssignments)
      .select();

    if (insertError) {
      console.log('❌ Erro ao inserir dados:', insertError);
      return;
    }

    console.log(`✅ Inseridos ${insertedData.length} registros de teste!`);
    console.log('\n📊 Dados inseridos:');
    insertedData.forEach((assignment, index) => {
      const user = users.find(u => u.id === assignment.user_id);
      const tool = tools.find(t => t.id === assignment.tool_id);
      console.log(`   ${index + 1}. ${user?.name} recebeu "${tool?.name}" (${assignment.status})`);
    });

    console.log('\n🎯 Agora você pode testar no navegador:');
    console.log('1. Acesse: http://localhost:8083');
    console.log('2. Faça login como usuário');
    console.log('3. Vá para "Semanal" no menu');
    console.log('4. Você deve ver as ferramentas de teste na lista!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
insertTestData(); 