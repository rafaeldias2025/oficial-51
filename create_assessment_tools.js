import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAssessmentTools() {
  try {
    console.log('🔧 Criando ferramentas de avaliação...');
    
    // 1. Criar "Roda da Saúde Galileu"
    console.log('\n📊 Criando "Roda da Saúde Galileu"...');
    const rodaSaude = {
      name: 'Roda da Saúde Galileu',
      description: 'Avaliação completa da saúde física, mental e emocional',
      category: 'health_assessment',
      questions: [
        {
          question: 'Como você avalia sua saúde física?',
          category: 'physical_health',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Como você avalia sua saúde mental?',
          category: 'mental_health',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Como você avalia seu equilíbrio emocional?',
          category: 'emotional_health',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Como você avalia sua qualidade do sono?',
          category: 'sleep_quality',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Como você avalia sua alimentação?',
          category: 'nutrition',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Como você avalia seu nível de estresse?',
          category: 'stress_level',
          type: 'scale',
          options: ['Muito Alto', 'Alto', 'Moderado', 'Baixo', 'Muito Baixo']
        }
      ],
      scoring_system: 'scale_1_10',
      created_by: '00000000-0000-0000-0000-000000000001' // Admin ID
    };
    
    const { data: rodaSaudeData, error: rodaSaudeError } = await supabase
      .from('coaching_tools')
      .insert([rodaSaude])
      .select();
      
    if (rodaSaudeError) {
      console.error('❌ Erro ao criar Roda da Saúde:', rodaSaudeError);
    } else {
      console.log('✅ Roda da Saúde Galileu criada:', rodaSaudeData[0].id);
    }
    
    // 2. Criar "SistemaGB"
    console.log('\n📊 Criando "SistemaGB"...');
    const sistemaGB = {
      name: 'SistemaGB',
      description: 'Avaliação do sistema gastrointestinal e bem-estar digestivo',
      category: 'digestive_health',
      questions: [
        {
          question: 'Como você avalia sua digestão?',
          category: 'digestion',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Com que frequência você sente desconforto abdominal?',
          category: 'abdominal_discomfort',
          type: 'frequency',
          options: ['Sempre', 'Frequentemente', 'Às vezes', 'Raramente', 'Nunca']
        },
        {
          question: 'Como você avalia sua regularidade intestinal?',
          category: 'bowel_regularity',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Boa', 'Excelente']
        },
        {
          question: 'Como você avalia sua energia após as refeições?',
          category: 'post_meal_energy',
          type: 'scale',
          options: ['Muito Baixa', 'Baixa', 'Moderada', 'Alta', 'Muito Alta']
        },
        {
          question: 'Você tem alguma intolerância alimentar?',
          category: 'food_intolerance',
          type: 'yes_no',
          options: ['Sim', 'Não']
        }
      ],
      scoring_system: 'scale_1_10',
      created_by: '00000000-0000-0000-0000-000000000001' // Admin ID
    };
    
    const { data: sistemaGBData, error: sistemaGBError } = await supabase
      .from('coaching_tools')
      .insert([sistemaGB])
      .select();
      
    if (sistemaGBError) {
      console.error('❌ Erro ao criar SistemaGB:', sistemaGBError);
    } else {
      console.log('✅ SistemaGB criado:', sistemaGBData[0].id);
    }
    
    // 3. Criar "Avaliação de Metas"
    console.log('\n📊 Criando "Avaliação de Metas"...');
    const avaliacaoMetas = {
      name: 'Avaliação de Metas',
      description: 'Avaliação das metas pessoais e objetivos de vida',
      category: 'goal_assessment',
      questions: [
        {
          question: 'Como você avalia a clareza das suas metas?',
          category: 'goal_clarity',
          type: 'scale',
          options: ['Muito Confusa', 'Confusa', 'Moderada', 'Clara', 'Muito Clara']
        },
        {
          question: 'Quão motivado você está para alcançar suas metas?',
          category: 'motivation',
          type: 'scale',
          options: ['Muito Baixo', 'Baixo', 'Moderado', 'Alto', 'Muito Alto']
        },
        {
          question: 'Como você avalia seu progresso atual?',
          category: 'current_progress',
          type: 'scale',
          options: ['Muito Ruim', 'Ruim', 'Regular', 'Bom', 'Excelente']
        },
        {
          question: 'Quanto tempo você dedica diariamente às suas metas?',
          category: 'time_dedication',
          type: 'time',
          options: ['0-15 min', '15-30 min', '30-60 min', '1-2 horas', '2+ horas']
        },
        {
          question: 'Como você avalia seu sistema de planejamento?',
          category: 'planning_system',
          type: 'scale',
          options: ['Inexistente', 'Básico', 'Regular', 'Bom', 'Excelente']
        }
      ],
      scoring_system: 'scale_1_10',
      created_by: '00000000-0000-0000-0000-000000000001' // Admin ID
    };
    
    const { data: avaliacaoMetasData, error: avaliacaoMetasError } = await supabase
      .from('coaching_tools')
      .insert([avaliacaoMetas])
      .select();
      
    if (avaliacaoMetasError) {
      console.error('❌ Erro ao criar Avaliação de Metas:', avaliacaoMetasError);
    } else {
      console.log('✅ Avaliação de Metas criada:', avaliacaoMetasData[0].id);
    }
    
    // 4. Verificar ferramentas criadas
    console.log('\n📋 Verificando ferramentas criadas...');
    const { data: allTools, error: allToolsError } = await supabase
      .from('coaching_tools')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (allToolsError) {
      console.error('❌ Erro ao buscar ferramentas:', allToolsError);
    } else {
      console.log('✅ Todas as ferramentas disponíveis:');
      allTools.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name} - ${tool.category}`);
      });
    }
    
    console.log('\n🎉 Ferramentas de avaliação criadas com sucesso!');
    console.log('💡 Agora o admin pode:');
    console.log('   1. Acessar a seção "Avaliações"');
    console.log('   2. Clicar em "Enviar Nova Avaliação"');
    console.log('   3. Selecionar uma das ferramentas criadas');
    console.log('   4. Enviar para os usuários');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar criação das ferramentas
createAssessmentTools(); 