import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle } from 'lucide-react';

// Dados mock da avaliação para teste
const MOCK_TOOL = {
  id: 1,
  name: "Roda da Saúde Galileu",
  question_data: [
    { number: 1, text: "Como está sua saúde mental?", category: "Neurológico" },
    { number: 2, text: "Como está sua saúde emocional?", category: "Emocional" },
    { number: 3, text: "Como está sua saúde cardiovascular?", category: "Cardiovascular" },
    { number: 4, text: "Como está sua saúde visual?", category: "Visual" },
    { number: 5, text: "Como está sua saúde auditiva?", category: "Auditivo" },
    { number: 6, text: "Como está sua saúde respiratória?", category: "Respiratório" },
    { number: 7, text: "Como está sua saúde vocal?", category: "Vocal" },
    { number: 8, text: "Como está sua saúde pulmonar?", category: "Pulmonar" },
    { number: 9, text: "Como está sua saúde digestiva?", category: "Digestivo" },
    { number: 10, text: "Como está sua saúde hepática (fígado)?", category: "Hepático" },
    { number: 11, text: "Como está sua saúde renal (rins)?", category: "Renal" },
    { number: 12, text: "Como está sua saúde muscular?", category: "Muscular" },
    { number: 13, text: "Como está sua saúde óssea?", category: "Ósseo" },
    { number: 14, text: "Como está sua saúde imunológica?", category: "Imunológico" },
    { number: 15, text: "Como está sua saúde endócrina (hormônios)?", category: "Endócrino" },
    { number: 16, text: "Como está sua saúde neurológica?", category: "Neurológico" }
  ]
};

export const SimpleAssessmentPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Inicializar respostas
  useEffect(() => {
    const initialAnswers: Record<string, number> = {};
    MOCK_TOOL.question_data.forEach((q: any) => {
      initialAnswers[q.number] = 0;
    });
    setAnswers(initialAnswers);
  }, []);
  
  // Calcular progresso
  const progress = Math.round((Object.values(answers).filter(a => a > 0).length / MOCK_TOOL.question_data.length) * 100);
  
  // Manipular resposta
  const handleAnswer = (value: number) => {
    const question = MOCK_TOOL.question_data[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [question.number]: value
    }));
  };
  
  // Próxima pergunta
  const nextQuestion = () => {
    if (currentQuestion < MOCK_TOOL.question_data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Pergunta anterior
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Finalizar avaliação
  const finishAssessment = async () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para finalizar a avaliação',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Calcular pontuação
      const scores = Object.values(answers).filter(a => a > 0);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      toast({
        title: 'Sucesso',
        description: `Avaliação concluída! Pontuação média: ${averageScore.toFixed(1)}`,
        variant: 'default'
      });
      
      // Simular salvamento
      console.log('Resultados da avaliação:', {
        user_id: user.id,
        tool_id: toolId,
        score: averageScore,
        answers,
        assignmentId
      });
      
      // Redirecionar para dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao finalizar avaliação:', err);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao finalizar a avaliação',
        variant: 'destructive'
      });
    }
  };
  
  const currentQ = MOCK_TOOL.question_data[currentQuestion];
  const currentAnswer = answers[currentQ.number];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold mt-4">{MOCK_TOOL.name}</h1>
          <p className="text-muted-foreground mt-2">
            Pergunta {currentQuestion + 1} de {MOCK_TOOL.question_data.length}
          </p>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {progress}% concluído
            </p>
          </div>
        </div>
        
        {/* Pergunta */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQ.text}
            </CardTitle>
            <p className="text-muted-foreground">
              Categoria: {currentQ.category}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Avalie de 1 (muito ruim) a 10 (excelente):
              </p>
              
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <Button
                    key={value}
                    variant={currentAnswer === value ? "default" : "outline"}
                    onClick={() => handleAnswer(value)}
                    className="h-12"
                  >
                    {value}
                  </Button>
                ))}
              </div>
              
              {currentAnswer > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">
                      Resposta selecionada: {currentAnswer}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Navegação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Anterior
          </Button>
          
          {currentQuestion === MOCK_TOOL.question_data.length - 1 ? (
            <Button
              onClick={finishAssessment}
              disabled={progress < 100}
              className="bg-green-600 hover:bg-green-700"
            >
              Finalizar Avaliação
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!currentAnswer}
            >
              Próxima
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleAssessmentPage; 