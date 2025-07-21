import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendAssessmentToLarissa() {
  try {
    console.log('🔄 Enviando avaliação para Larissa...');

    // 1. Buscar o usuário Larissa
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'larissa@institutodossonhos.com')
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar usuário Larissa:', userError);
      return;
    }

    console.log('✅ Usuário Larissa encontrado:', userData);

    // 2. Criar uma nova avaliação
    const assessmentData = {
      user_id: userData.id,
      title: 'Avaliação de Bem-estar Completa',
      description: 'Avaliação personalizada para Larissa Barbosa',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([assessmentData])
      .select()
      .single();

    if (assessmentError) {
      console.error('❌ Erro ao criar avaliação:', assessmentError);
      return;
    }

    console.log('✅ Avaliação criada:', assessment);

    // 3. Adicionar perguntas à avaliação
    const questions = [
      {
        assessment_id: assessment.id,
        question_text: 'Como você se sente hoje?',
        question_type: 'scale',
        options: ['Muito mal', 'Mal', 'Regular', 'Bem', 'Muito bem'],
        order: 1
      },
      {
        assessment_id: assessment.id,
        question_text: 'Qual é seu nível de energia hoje?',
        question_type: 'scale',
        options: ['Muito baixo', 'Baixo', 'Regular', 'Alto', 'Muito alto'],
        order: 2
      },
      {
        assessment_id: assessment.id,
        question_text: 'Como está sua qualidade do sono?',
        question_type: 'scale',
        options: ['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente'],
        order: 3
      },
      {
        assessment_id: assessment.id,
        question_text: 'Qual é sua meta principal de saúde?',
        question_type: 'multiple_choice',
        options: ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Reduzir estresse', 'Melhorar alimentação'],
        order: 4
      },
      {
        assessment_id: assessment.id,
        question_text: 'Quantas vezes por semana você pratica exercícios?',
        question_type: 'multiple_choice',
        options: ['Nunca', '1-2 vezes', '3-4 vezes', '5-6 vezes', 'Todos os dias'],
        order: 5
      }
    ];

    const { data: questionsData, error: questionsError } = await supabase
      .from('assessment_questions')
      .insert(questions)
      .select();

    if (questionsError) {
      console.error('❌ Erro ao adicionar perguntas:', questionsError);
      return;
    }

    console.log('✅ Perguntas adicionadas:', questionsData);

    // 4. Enviar notificação para Larissa
    const notification = {
      user_id: userData.id,
      title: 'Nova Avaliação Disponível',
      message: 'Você tem uma nova avaliação de bem-estar para responder!',
      type: 'assessment',
      read: false,
      created_at: new Date().toISOString()
    };

    const { data: notificationData, error: notificationError } = await supabase
      .from('notifications')
      .insert([notification])
      .select();

    if (notificationError) {
      console.error('❌ Erro ao enviar notificação:', notificationError);
    } else {
      console.log('✅ Notificação enviada:', notificationData);
    }

    console.log('🎉 Avaliação enviada com sucesso para Larissa!');
    console.log('📋 Detalhes da avaliação:');
    console.log(`   - ID: ${assessment.id}`);
    console.log(`   - Título: ${assessment.title}`);
    console.log(`   - Perguntas: ${questions.length}`);
    console.log(`   - Status: ${assessment.status}`);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
sendAssessmentToLarissa(); 