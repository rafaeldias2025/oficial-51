import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle,
  Brain,
  Heart,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { useSessionPlayer } from '@/hooks/useSessionPlayer';
import { ToolQuestion, SessionResponse } from '@/types/session-system';

interface SessionPlayerProps {
  sessionId: string;
  onComplete: (results: any) => void;
  onBack: () => void;
}

export const SessionPlayer: React.FC<SessionPlayerProps> = ({ 
  sessionId, 
  onComplete, 
  onBack 
}) => {
  const { 
    currentQuestion, 
    progress, 
    loading, 
    error, 
    submitResponse, 
    saveProgress, 
    completeSession 
  } = useSessionPlayer(sessionId);

  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mental':
        return <Brain className="w-5 h-5 text-blue-600" />;
      case 'emocional':
        return <Heart className="w-5 h-5 text-green-600" />;
      case 'relacionamentos':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'objetivos':
        return <Target className="w-5 h-5 text-orange-600" />;
      default:
        return <Zap className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mental':
        return 'border-blue-200 bg-blue-50';
      case 'emocional':
        return 'border-green-200 bg-green-50';
      case 'relacionamentos':
        return 'border-purple-200 bg-purple-50';
      case 'objetivos':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !currentResponse) return;

    setIsSubmitting(true);

    try {
      const response: SessionResponse = {
        id: '',
        sessionId,
        questionId: currentQuestion.id,
        responseValue: currentResponse,
        responseText: typeof currentResponse === 'string' ? currentResponse : undefined,
        category: currentQuestion.category,
        timestamp: new Date()
      };

      await submitResponse(response);
      setCurrentResponse(null);
    } catch (err) {
      console.error('Erro ao submeter resposta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      const results = await completeSession();
      onComplete(results);
    } catch (err) {
      console.error('Erro ao completar sessão:', err);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.questionType) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">
                {currentResponse || 5}
              </span>
              <span className="text-sm text-gray-500 ml-2">/ 10</span>
            </div>
            <Slider
              value={[currentResponse || 5]}
              onValueChange={(value) => setCurrentResponse(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Muito Baixo</span>
              <span>Muito Alto</span>
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={currentResponse}
            onValueChange={setCurrentResponse}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'yes_no':
        return (
          <RadioGroup
            value={currentResponse}
            onValueChange={setCurrentResponse}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="yes" />
              <Label htmlFor="yes" className="text-sm">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="no" />
              <Label htmlFor="no" className="text-sm">Não</Label>
            </div>
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={currentResponse || ''}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Digite sua resposta..."
            className="min-h-[120px]"
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sessão...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h3 className="text-xl font-semibold">Sessão Concluída!</h3>
          <p className="text-gray-600 mb-6">
            Você respondeu todas as perguntas. Clique em "Ver Resultados" para ver sua análise.
          </p>
          <Button onClick={handleComplete} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Ver Resultados
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Save className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Salvamento automático</span>
        </div>
      </div>

      {/* Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progresso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Pergunta */}
      <Card className={`border-2 ${getCategoryColor(currentQuestion.category)}`}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(currentQuestion.category)}
            <Badge variant="outline" className="text-xs">
              {currentQuestion.category}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.questionText}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderQuestionInput()}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={saveProgress}
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Progresso
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={!currentResponse || isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Salvando...
            </>
          ) : (
            <>
              Próxima Pergunta
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}; 