import { createClient } from '@supabase/supabase-js';

// Criar cliente Supabase com service_role para contornar RLS
const supabaseAdmin = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function createAllTools() {
  console.log('🚀 Criando todas as ferramentas baseadas nos sistemas anteriores...');

  const tools = [
    {
      name: "Avaliação de Metas e Objetivos",
      description: "Avaliação completa para identificar e planejar suas metas pessoais e profissionais, incluindo planejamento estratégico e acompanhamento de progresso.",
      category: "Planejamento",
      estimated_time: 45,
      total_questions: 25,
      question_data: [
        {
          text: "Quais são suas principais metas para os próximos 6 meses?",
          type: "text",
          category: "Definição de Metas",
          options: {
            max_length: 500,
            required: true
          }
        },
        {
          text: "Em uma escala de 1 a 10, quão confiante você se sente em alcançar suas metas?",
          type: "scale",
          category: "Confiança",
          options: {
            min: 1,
            max: 10,
            min_label: "Muito baixa",
            max_label: "Muito alta",
            show_numbers: true,
            show_labels: true
          }
        },
        {
          text: "Quais obstáculos você identifica para alcançar suas metas?",
          type: "multiple_choice",
          category: "Obstáculos",
          options: {
            choices: [
              "Falta de tempo",
              "Falta de recursos financeiros",
              "Falta de conhecimento",
              "Falta de motivação",
              "Medo de falhar",
              "Outros"
            ],
            single_selection: false,
            include_other: true,
            randomize: false
          }
        },
        {
          text: "Classifique estas áreas de sua vida por prioridade:",
          type: "matrix",
          category: "Prioridades",
          options: {
            rows: [
              "Carreira profissional",
              "Saúde física",
              "Relacionamentos",
              "Desenvolvimento pessoal",
              "Finanças",
              "Lazer e diversão"
            ],
            columns: [
              "Baixa prioridade",
              "Média prioridade", 
              "Alta prioridade",
              "Máxima prioridade"
            ]
          }
        },
        {
          text: "Selecione as imagens que representam como você se sente em relação ao seu futuro:",
          type: "image_selection",
          category: "Visão de Futuro",
          options: {
            images: [
              { url: "/assets/future-optimistic.jpg", label: "Otimista" },
              { url: "/assets/future-anxious.jpg", label: "Ansioso" },
              { url: "/assets/future-confident.jpg", label: "Confiante" },
              { url: "/assets/future-uncertain.jpg", label: "Incerto" },
              { url: "/assets/future-excited.jpg", label: "Empolgado" },
              { url: "/assets/future-worried.jpg", label: "Preocupado" }
            ],
            multiple_selection: true,
            show_labels: true,
            show_carousel: true,
            show_grid: false
          }
        }
      ],
      scoring_config: {
        enabled: true,
        method: "sum_by_categories",
        categories: ["Definição de Metas", "Confiança", "Obstáculos", "Prioridades", "Visão de Futuro"],
        ranges: [
          {
            category: "Definição de Metas",
            ranges: [
              { min: 0, max: 3, label: "Metas pouco definidas", interpretation: "Necessita de maior clareza nas metas" },
              { min: 4, max: 7, label: "Metas moderadamente definidas", interpretation: "Metas razoavelmente claras" },
              { min: 8, max: 10, label: "Metas bem definidas", interpretation: "Excelente clareza nas metas" }
            ]
          }
        ],
        visualization: {
          charts: ["radar", "bar", "pie"],
          report_format: ["executive_summary", "detailed_analysis", "personalized_recommendations", "action_plan"],
          export_options: ["pdf"],
          share_options: true
        },
        display: {
          icon: "🎯",
          highlight_color: "#E50914",
          theme: "netflix_standard",
          show_progress_bar: true,
          show_immediate_results: true,
          allow_history_view: true,
          require_all_answers: false,
          allow_save_continue: true,
          show_estimated_time: false,
          show_question_number: true
        },
        notifications: {
          send_on_assignment: true,
          reminder_after_3_days: true,
          notify_admin_on_completion: true,
          channels: ["in_app", "email"],
          message: "Uma nova ferramenta foi compartilhada com você!"
        }
      }
    },
    {
      name: "Avaliação de Bem-estar Emocional",
      description: "Avaliação completa do seu bem-estar emocional, incluindo autoconhecimento, gestão de emoções e saúde mental.",
      category: "Saúde Mental",
      estimated_time: 35,
      total_questions: 30,
      question_data: [
        {
          text: "Como você se sente emocionalmente na maioria dos dias?",
          type: "multiple_choice",
          category: "Estado Emocional",
          options: {
            choices: [
              "Muito feliz e satisfeito",
              "Geralmente positivo",
              "Neutro",
              "Às vezes triste",
              "Frequentemente ansioso",
              "Muito estressado"
            ],
            single_selection: true,
            include_other: false,
            randomize: false
          }
        },
        {
          text: "Em uma escala de 1 a 10, quão bem você gerencia o estresse?",
          type: "scale",
          category: "Gestão de Estresse",
          options: {
            min: 1,
            max: 10,
            min_label: "Muito mal",
            max_label: "Muito bem",
            show_numbers: true,
            show_labels: true
          }
        },
        {
          text: "Quais atividades você pratica para cuidar da sua saúde mental?",
          type: "multiple_choice",
          category: "Autocuidado",
          options: {
            choices: [
              "Meditação",
              "Exercícios físicos",
              "Terapia",
              "Hobbies",
              "Tempo com amigos/família",
              "Leitura",
              "Nenhuma"
            ],
            single_selection: false,
            include_other: true,
            randomize: false
          }
        },
        {
          text: "Classifique estas emoções pela frequência com que você as experimenta:",
          type: "matrix",
          category: "Frequência Emocional",
          options: {
            rows: [
              "Alegria",
              "Tristeza", 
              "Ansiedade",
              "Raiva",
              "Gratidão",
              "Frustração"
            ],
            columns: [
              "Nunca",
              "Raramente",
              "Às vezes",
              "Frequentemente",
              "Sempre"
            ]
          }
        },
        {
          text: "Desenhe como você se sente emocionalmente neste momento:",
          type: "drawing",
          category: "Expressão Emocional",
          options: {
            include_drawing_tools: true,
            allow_image_upload: true,
            include_description_field: true
          }
        }
      ],
      scoring_config: {
        enabled: true,
        method: "sum_by_categories",
        categories: ["Estado Emocional", "Gestão de Estresse", "Autocuidado", "Frequência Emocional", "Expressão Emocional"],
        ranges: [
          {
            category: "Estado Emocional",
            ranges: [
              { min: 0, max: 3, label: "Bem-estar baixo", interpretation: "Necessita de atenção à saúde mental" },
              { min: 4, max: 7, label: "Bem-estar moderado", interpretation: "Bem-estar em desenvolvimento" },
              { min: 8, max: 10, label: "Bem-estar alto", interpretation: "Excelente bem-estar emocional" }
            ]
          }
        ],
        visualization: {
          charts: ["radar", "bar", "pie"],
          report_format: ["executive_summary", "detailed_analysis", "personalized_recommendations", "action_plan"],
          export_options: ["pdf"],
          share_options: true
        },
        display: {
          icon: "😌",
          highlight_color: "#E50914",
          theme: "netflix_standard",
          show_progress_bar: true,
          show_immediate_results: true,
          allow_history_view: true,
          require_all_answers: false,
          allow_save_continue: true,
          show_estimated_time: false,
          show_question_number: true
        },
        notifications: {
          send_on_assignment: true,
          reminder_after_3_days: true,
          notify_admin_on_completion: true,
          channels: ["in_app", "email"],
          message: "Uma nova ferramenta foi compartilhada com você!"
        }
      }
    },
    {
      name: "Avaliação de Produtividade",
      description: "Avaliação completa dos seus hábitos de produtividade, organização e eficiência no trabalho e vida pessoal.",
      category: "Produtividade",
      estimated_time: 50,
      total_questions: 35,
      question_data: [
        {
          text: "Em uma escala de 1 a 10, quão produtivo você se considera?",
          type: "scale",
          category: "Autoavaliação",
          options: {
            min: 1,
            max: 10,
            min_label: "Muito baixa",
            max_label: "Muito alta",
            show_numbers: true,
            show_labels: true
          }
        },
        {
          text: "Quais ferramentas você usa para organizar suas tarefas?",
          type: "multiple_choice",
          category: "Ferramentas",
          options: {
            choices: [
              "Lista de tarefas física",
              "Aplicativo de notas",
              "Calendário digital",
              "Planner/agenda",
              "Projeto no computador",
              "Nenhuma ferramenta"
            ],
            single_selection: false,
            include_other: true,
            randomize: false
          }
        },
        {
          text: "Classifique estas atividades pela sua eficiência ao realizá-las:",
          type: "matrix",
          category: "Eficiência",
          options: {
            rows: [
              "Planejamento diário",
              "Execução de tarefas",
              "Gestão de tempo",
              "Foco e concentração",
              "Delegação de responsabilidades",
              "Revisão de resultados"
            ],
            columns: [
              "Muito ineficiente",
              "Ineficiente",
              "Neutro",
              "Eficiente",
              "Muito eficiente"
            ]
          }
        },
        {
          text: "Selecione as imagens que representam seus maiores desafios de produtividade:",
          type: "image_selection",
          category: "Desafios",
          options: {
            images: [
              { url: "/assets/productivity-distraction.jpg", label: "Distrações" },
              { url: "/assets/productivity-procrastination.jpg", label: "Procrastinação" },
              { url: "/assets/productivity-overwhelm.jpg", label: "Sobrecarga" },
              { url: "/assets/productivity-perfectionism.jpg", label: "Perfeccionismo" },
              { url: "/assets/productivity-energy.jpg", label: "Falta de energia" },
              { url: "/assets/productivity-focus.jpg", label: "Dificuldade de foco" }
            ],
            multiple_selection: true,
            show_labels: true,
            show_carousel: true,
            show_grid: false
          }
        },
        {
          text: "Desenhe como você organiza seu ambiente de trabalho ideal:",
          type: "drawing",
          category: "Ambiente de Trabalho",
          options: {
            include_drawing_tools: true,
            allow_image_upload: true,
            include_description_field: true
          }
        }
      ],
      scoring_config: {
        enabled: true,
        method: "sum_by_categories",
        categories: ["Autoavaliação", "Ferramentas", "Eficiência", "Desafios", "Ambiente de Trabalho"],
        ranges: [
          {
            category: "Autoavaliação",
            ranges: [
              { min: 0, max: 3, label: "Produtividade baixa", interpretation: "Necessita de melhorias significativas" },
              { min: 4, max: 7, label: "Produtividade moderada", interpretation: "Há espaço para otimização" },
              { min: 8, max: 10, label: "Produtividade alta", interpretation: "Excelente nível de produtividade" }
            ]
          }
        ],
        visualization: {
          charts: ["radar", "bar", "pie"],
          report_format: ["executive_summary", "detailed_analysis", "personalized_recommendations", "action_plan"],
          export_options: ["pdf"],
          share_options: true
        },
        display: {
          icon: "⚡",
          highlight_color: "#E50914",
          theme: "netflix_standard",
          show_progress_bar: true,
          show_immediate_results: true,
          allow_history_view: true,
          require_all_answers: false,
          allow_save_continue: true,
          show_estimated_time: false,
          show_question_number: true
        },
        notifications: {
          send_on_assignment: true,
          reminder_after_3_days: true,
          notify_admin_on_completion: true,
          channels: ["in_app", "email"],
          message: "Uma nova ferramenta foi compartilhada com você!"
        }
      }
    },
    {
      name: "Avaliação de Relacionamentos",
      description: "Avaliação completa dos seus relacionamentos interpessoais, habilidades sociais e comunicação.",
      category: "Relacionamentos",
      estimated_time: 25,
      total_questions: 20,
      question_data: [
        {
          text: "Em uma escala de 1 a 10, quão satisfeito você está com seus relacionamentos?",
          type: "scale",
          category: "Satisfação",
          options: {
            min: 1,
            max: 10,
            min_label: "Muito insatisfeito",
            max_label: "Muito satisfeito",
            show_numbers: true,
            show_labels: true
          }
        },
        {
          text: "Quais são seus maiores desafios nos relacionamentos?",
          type: "multiple_choice",
          category: "Desafios",
          options: {
            choices: [
              "Comunicação",
              "Confiança",
              "Tempo para dedicar",
              "Conflitos frequentes",
              "Dificuldade de expressar emoções",
              "Expectativas não alinhadas"
            ],
            single_selection: false,
            include_other: true,
            randomize: false
          }
        },
        {
          text: "Classifique estas habilidades sociais pela sua proficiência:",
          type: "matrix",
          category: "Habilidades Sociais",
          options: {
            rows: [
              "Escuta ativa",
              "Empatia",
              "Assertividade",
              "Resolução de conflitos",
              "Expressão de sentimentos",
              "Limites pessoais"
            ],
            columns: [
              "Muito baixa",
              "Baixa",
              "Média",
              "Alta",
              "Muito alta"
            ]
          }
        },
        {
          text: "Selecione as imagens que representam como você se sente em situações sociais:",
          type: "image_selection",
          category: "Comportamento Social",
          options: {
            images: [
              { url: "/assets/social-confident.jpg", label: "Confiante" },
              { url: "/assets/social-anxious.jpg", label: "Ansioso" },
              { url: "/assets/social-extroverted.jpg", label: "Extrovertido" },
              { url: "/assets/social-introverted.jpg", label: "Introvertido" },
              { url: "/assets/social-empathic.jpg", label: "Empático" },
              { url: "/assets/social-reserved.jpg", label: "Reservado" }
            ],
            multiple_selection: true,
            show_labels: true,
            show_carousel: true,
            show_grid: false
          }
        },
        {
          text: "Desenhe como você se vê em um relacionamento ideal:",
          type: "drawing",
          category: "Visão de Relacionamento",
          options: {
            include_drawing_tools: true,
            allow_image_upload: true,
            include_description_field: true
          }
        }
      ],
      scoring_config: {
        enabled: true,
        method: "sum_by_categories",
        categories: ["Satisfação", "Desafios", "Habilidades Sociais", "Comportamento Social", "Visão de Relacionamento"],
        ranges: [
          {
            category: "Satisfação",
            ranges: [
              { min: 0, max: 3, label: "Satisfação baixa", interpretation: "Necessita de atenção aos relacionamentos" },
              { min: 4, max: 7, label: "Satisfação moderada", interpretation: "Relacionamentos em desenvolvimento" },
              { min: 8, max: 10, label: "Satisfação alta", interpretation: "Excelentes relacionamentos" }
            ]
          }
        ],
        visualization: {
          charts: ["radar", "bar", "pie"],
          report_format: ["executive_summary", "detailed_analysis", "personalized_recommendations", "action_plan"],
          export_options: ["pdf"],
          share_options: true
        },
        display: {
          icon: "💕",
          highlight_color: "#E50914",
          theme: "netflix_standard",
          show_progress_bar: true,
          show_immediate_results: true,
          allow_history_view: true,
          require_all_answers: false,
          allow_save_continue: true,
          show_estimated_time: false,
          show_question_number: true
        },
        notifications: {
          send_on_assignment: true,
          reminder_after_3_days: true,
          notify_admin_on_completion: true,
          channels: ["in_app", "email"],
          message: "Uma nova ferramenta foi compartilhada com você!"
        }
      }
    }
  ];

  try {
    console.log(`📋 Criando ${tools.length} ferramentas...`);

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      console.log(`\n🔄 Criando ferramenta ${i + 1}/${tools.length}: ${tool.name}`);

      const { data, error } = await supabaseAdmin
        .from('coaching_tools')
        .insert(tool)
        .select()
        .single();

      if (error) {
        console.error(`❌ Erro ao criar ferramenta "${tool.name}":`, error);
      } else {
        console.log(`✅ Ferramenta "${tool.name}" criada com sucesso!`);
      }
    }

    console.log('\n🎉 Todas as ferramentas foram criadas!');
    console.log('\n📊 RESUMO DAS FERRAMENTAS CRIADAS:');
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.total_questions} perguntas, ${tool.estimated_time} min)`);
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createAllTools(); 