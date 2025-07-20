import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function loginLarissaManual() {
  try {
    console.log('🔐 Fazendo login manual como Larissa...');
    
    // 1. Verificar se Larissa existe
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
    console.log(`   - ID: ${larissa.id}`);
    console.log(`   - Email: ${larissa.email}`);
    
    // 2. Verificar todas as avaliações da Larissa
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
      console.error('❌ Erro ao buscar avaliações:', allError);
    } else {
      console.log('✅ Todas as avaliações da Larissa:');
      allAssignments.forEach((assignment, index) => {
        console.log(`   ${index + 1}. ${assignment.coaching_tools.name} - ${assignment.status} - ${assignment.assessment_results?.score || 'N/A'}/10`);
      });
    }
    
    // 3. Verificar todas as sessões da Larissa
    console.log('\n📋 Verificando sessões da Larissa...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', larissa.id)
      .order('created_at', { ascending: false });
      
    if (sessionsError) {
      console.error('❌ Erro ao buscar sessões:', sessionsError);
    } else {
      console.log('✅ Sessões da Larissa:');
      sessions.forEach((session, index) => {
        console.log(`   ${index + 1}. ${session.title} - ${session.status}`);
      });
    }
    
    // 4. Verificar dados de saúde da Larissa
    console.log('\n🏥 Verificando dados de saúde da Larissa...');
    const { data: healthData, error: healthError } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', larissa.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (healthError) {
      console.error('❌ Erro ao buscar dados de saúde:', healthError);
    } else {
      console.log('✅ Dados de saúde da Larissa:');
      healthData.forEach((metric, index) => {
        console.log(`   ${index + 1}. ${metric.metric_type}: ${metric.value} - ${metric.created_at}`);
      });
    }
    
    // 5. Verificar progresso da Larissa
    console.log('\n📈 Verificando progresso da Larissa...');
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', larissa.id)
      .single();
      
    if (progressError) {
      console.error('❌ Erro ao buscar progresso:', progressError);
    } else {
      console.log('✅ Progresso da Larissa:');
      console.log(`   - Peso atual: ${progress.current_weight}kg`);
      console.log(`   - Peso inicial: ${progress.initial_weight}kg`);
      console.log(`   - Meta: ${progress.target_weight}kg`);
      console.log(`   - IMC: ${progress.current_bmi}`);
      console.log(`   - Streak: ${progress.streak_days} dias`);
    }
    
    // 6. Gerar links para teste manual
    console.log('\n🔗 Links para teste manual:');
    console.log(`   - Dashboard: http://localhost:8082/dashboard`);
    console.log(`   - Avaliações: http://localhost:8082/dashboard (clique em "Avaliações")`);
    console.log(`   - Sessões: http://localhost:8082/dashboard (clique em "Sessões")`);
    console.log(`   - Resultados Roda da Saúde: http://localhost:8082/assessment/results/3`);
    console.log(`   - Resultados Instituto dos Sonhos: http://localhost:8082/assessment/results/4`);
    
    console.log('\n🎉 Login manual como Larissa concluído!');
    console.log('📊 Resumo do perfil da Larissa:');
    console.log(`   - Nome: ${larissa.full_name}`);
    console.log(`   - Email: ${larissa.email}`);
    console.log(`   - Avaliações: ${allAssignments?.length || 0}`);
    console.log(`   - Sessões: ${sessions?.length || 0}`);
    console.log(`   - Dados de saúde: ${healthData?.length || 0}`);
    
    console.log('\n💡 Para testar manualmente:');
    console.log('   1. Acesse: http://localhost:8082/dashboard');
    console.log('   2. Clique em "Avaliações" no menu lateral');
    console.log('   3. Clique em "Sessões" no menu lateral');
    console.log('   4. Teste cada botão e funcionalidade');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o login manual
loginLarissaManual(); 