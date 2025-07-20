import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function enviar4Avaliacoes() {
  console.log('🎯 ENVIANDO 4 AVALIAÇÕES - AUDITORIA MANUAL');
  console.log('=============================================');
  
  try {
    // Buscar usuários selecionados
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('email', [
        'larissa@institutodossonhos.com',
        'medodo20@gmail.com', 
        'lucasnascimento@gmail.com',
        'mariass@gmail.com'
      ]);
      
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      return;
    }
    
    console.log(`✅ Usuários encontrados: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.full_name} (${user.email})`);
    });
    
    // Buscar ferramentas disponíveis
    const { data: tools, error: toolsError } = await supabase
      .from('coaching_tools')
      .select('id, name, total_questions, estimated_time')
      .limit(4);
      
    if (toolsError) {
      console.error('❌ Erro ao buscar ferramentas:', toolsError);
      return;
    }
    
    console.log(`✅ Ferramentas encontradas: ${tools.length}`);
    tools.forEach(tool => {
      console.log(`   - ${tool.name} (${tool.total_questions} perguntas)`);
    });
    
    // Criar 4 avaliações diferentes
    const avaliacoes = [
      {
        user_id: users[0].id, // Larissa Barbosa
        tool_id: tools[0].id, // Primeira ferramenta
        instructions: 'Avaliação de Metas e Objetivos - Complete com atenção e honestidade',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: users[1].id, // Larissa Medodo
        tool_id: tools[1].id, // Segunda ferramenta
        instructions: 'Avaliação de Bem-estar Emocional - Reflita sobre seu estado emocional',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: users[2].id, // Lucas Nascimento
        tool_id: tools[2].id, // Terceira ferramenta
        instructions: 'Avaliação de Produtividade - Analise seus hábitos e rotinas',
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: users[3].id, // Maria Aparecida
        tool_id: tools[3].id, // Quarta ferramenta
        instructions: 'Avaliação de Relacionamentos - Reflita sobre suas conexões pessoais',
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    console.log('\n📤 Enviando 4 avaliações...');
    
    const { data: createdAssignments, error: createError } = await supabase
      .from('assessment_assignments')
      .insert(avaliacoes)
      .select();
      
    if (createError) {
      console.error('❌ Erro ao criar avaliações:', createError);
      return;
    }
    
    console.log('✅ Avaliações enviadas com sucesso!');
    createdAssignments.forEach((assignment, index) => {
      const user = users.find(u => u.id === assignment.user_id);
      const tool = tools.find(t => t.id === assignment.tool_id);
      console.log(`   ${index + 1}. ${user?.full_name} - ${tool?.name} (ID: ${assignment.id})`);
    });
    
    console.log('\n🎯 AUDITORIA - 4 AVALIAÇÕES ENVIADAS!');
    console.log('=============================================');
    console.log('✅ Larissa Barbosa - Avaliação de Metas e Objetivos');
    console.log('✅ Larissa Medodo - Avaliação de Bem-estar Emocional');
    console.log('✅ Lucas Nascimento - Avaliação de Produtividade');
    console.log('✅ Maria Aparecida - Avaliação de Relacionamentos');
    
    console.log('\n💡 PRÓXIMOS PASSOS PARA TESTE MANUAL:');
    console.log('1. Testar interface do usuário Larissa Barbosa');
    console.log('2. Verificar se avaliação aparece na aba "Pendentes"');
    console.log('3. Testar resposta da avaliação');
    console.log('4. Verificar resultados e gráficos');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar envio
enviar4Avaliacoes(); 