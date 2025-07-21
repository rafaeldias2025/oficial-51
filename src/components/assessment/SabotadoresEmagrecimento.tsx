import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Brain, 
  Heart, 
  Target,
  Image,
  Palette,
  Trash2,
  RotateCcw,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface SabotadoresEmagrecimentoProps {
  onComplete: (results: any) => void;
  onSaveProgress: (progress: any) => void;
}

interface Question {
  id: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'matrix' | 'image_selection' | 'drawing';
  category: string;
  options: any;
  required: boolean;
}

interface Answer {
  questionId: number;
  value: any;
  category: string;
}

// Sistema de Lixeira de Segurança
interface PerguntaComLixeira {
  id: number;
  texto: string;
  ativa: boolean;
  naLixeira: boolean;
  dataExclusao?: Date;
  categoria?: string;
}

export const SabotadoresEmagrecimento: React.FC<SabotadoresEmagrecimentoProps> = ({
  onComplete,
  onSaveProgress
}) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mostrarLixeira, setMostrarLixeira] = useState(false);
  const [perguntasComLixeira, setPerguntasComLixeira] = useState<PerguntaComLixeira[]>([]);
  const [perguntasAtivas, setPerguntasAtivas] = useState<string[]>([]);

  // Todas as perguntas originais (115 perguntas)
  const perguntasOriginais = [
    "Com que frequência você come por motivos emocionais?",
    "Você costuma se criticar quando não segue a dieta?",
    "Classifique estes alimentos de acordo com sua frequência de consumo quando está estressado(a)",
    "Selecione as imagens que representam como você se sente após comer em excesso",
    "Desenhe como você se sente em relação ao seu corpo",
    // ... (adicionar as 115 perguntas completas aqui)
  ];

  // Função para obter categoria da pergunta
  const getCategoriaPergunta = (id: number): string => {
    const categorias = {
      'Emocional': [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 91, 94, 97, 100, 103, 106, 109, 112, 115],
      'Autocrítica': [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113],
      'Comportamento Alimentar': [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114],
      'Imagem Corporal': [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115]
    };
    
    for (const [categoria, ids] of Object.entries(categorias)) {
      if (ids.includes(id)) {
        return categoria;
      }
    }
    return 'outros';
  };

  // Função para obter perguntas ativas (não na lixeira)
  const getPerguntasAtivas = (perguntas: PerguntaComLixeira[]): string[] => {
    return perguntas
      .filter(p => p.ativa && !p.naLixeira)
      .map(p => p.texto);
  };

  // Função para inicializar perguntas com sistema de lixeira
  const inicializarPerguntasComLixeira = (): PerguntaComLixeira[] => {
    return perguntasOriginais.map((texto, index) => ({
      id: index + 1,
      texto,
      ativa: true,
      naLixeira: false,
      categoria: getCategoriaPergunta(index + 1)
    }));
  };

  // Inicializar perguntas com lixeira
  useEffect(() => {
    const perguntasIniciais = inicializarPerguntasComLixeira();
    setPerguntasComLixeira(perguntasIniciais);
    setPerguntasAtivas(getPerguntasAtivas(perguntasIniciais));
  }, []);

  // Funções de gerenciamento da lixeira
  const moverParaLixeira = (id: number) => {
    setPerguntasComLixeira(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, naLixeira: true, dataExclusao: new Date(), ativa: false }
          : p
      )
    );
    console.log('Pergunta movida para a lixeira de segurança');
    atualizarPerguntasAtivas();
  };

  const restaurarDaLixeira = (id: number) => {
    setPerguntasComLixeira(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, naLixeira: false, dataExclusao: undefined, ativa: true }
          : p
      )
    );
    console.log('Pergunta restaurada com sucesso');
    atualizarPerguntasAtivas();
  };

  const excluirDefinitivamente = (id: number) => {
    setPerguntasComLixeira(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ativa: false, naLixeira: false }
          : p
      )
    );
    console.log('Pergunta excluída definitivamente');
    atualizarPerguntasAtivas();
  };

  const atualizarPerguntasAtivas = () => {
    const ativas = getPerguntasAtivas(perguntasComLixeira);
    setPerguntasAtivas(ativas);
  };

  const getPerguntasNaLixeira = () => {
    return perguntasComLixeira.filter(p => p.naLixeira);
  };

  const limparLixeira = () => {
    setPerguntasComLixeira(prev =>
      prev.map(p =>
        p.naLixeira
          ? { ...p, ativa: false, naLixeira: false }
          : p
      )
    );
    console.log('Lixeira limpa com sucesso');
    atualizarPerguntasAtivas();
  };

  const questions: Question[] = [
    {
      id: 1,
      text: "Com que frequência você come por motivos emocionais?",
      type: "scale",
      category: "Emocional",
      required: true,
      options: {
        min: 1,
        max: 10,
        min_label: "Nunca",
        max_label: "Sempre",
        show_numbers: true,
        show_labels: true
      }
    },
    {
      id: 2,
      text: "Você costuma se criticar quando não segue a dieta?",
      type: "multiple_choice",
      category: "Autocrítica",
      required: true,
      options: {
        choices: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"],
        single_selection: true,
        include_other: false,
        randomize: false
      }
    },
    {
      id: 3,
      text: "Classifique estes alimentos de acordo com sua frequência de consumo quando está estressado(a)",
      type: "matrix",
      category: "Comportamento Alimentar",
      required: true,
      options: {
        rows: ["Doces e chocolates", "Fast food", "Salgadinhos", "Refrigerantes"],
        columns: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
      }
    },
    {
      id: 4,
      text: "Selecione as imagens que representam como você se sente após comer em excesso",
      type: "image_selection",
      category: "Emocional",
      required: true,
      options: {
        images: [
          { url: "/assets/emotion-sad.jpg", label: "Tristeza" },
          { url: "/assets/emotion-guilt.jpg", label: "Culpa" },
          { url: "/assets/emotion-anger.jpg", label: "Raiva" },
          { url: "/assets/emotion-disappointment.jpg", label: "Decepção" },
          { url: "/assets/emotion-shame.jpg", label: "Vergonha" },
          { url: "/assets/emotion-frustration.jpg", label: "Frustração" }
        ],
        multiple_selection: true,
        show_labels: true,
        show_carousel: true,
        show_grid: false
      }
    },
    {
      id: 5,
      text: "Desenhe como você se sente em relação ao seu corpo",
      type: "drawing",
      category: "Imagem Corporal",
      required: true,
      options: {
        include_drawing_tools: true,
        allow_image_upload: true,
        include_description_field: true
      }
    }
  ];

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    const progressValue = ((currentQuestion + 1) / questions.length) * 100;
    setProgress(progressValue);
  }, [currentQuestion]);

  const handleAnswer = (value: any) => {
    // Garantir que o valor seja primitivo
    let cleanValue = value;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        cleanValue = value;
      } else {
        console.warn('Tentando salvar objeto como resposta, convertendo para string:', value);
        cleanValue = JSON.stringify(value);
      }
    }
    
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQ.id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = {
        questionId: currentQ.id,
        value: cleanValue,
        category: currentQ.category
      };
    } else {
      newAnswers.push({
        questionId: currentQ.id,
        value: cleanValue,
        category: currentQ.category
      });
    }
    
    setAnswers(newAnswers);
    onSaveProgress({ currentQuestion, answers: newAnswers });
  };

  const getCurrentAnswer = () => {
    const answer = answers.find(a => a.questionId === currentQ.id);
    if (!answer) return null;
    
    // Garantir que o valor seja primitivo
    const value = answer.value;
    if (typeof value === 'object' && value !== null) {
      // Se for um objeto, retornar null para evitar erro do React
      console.warn('Valor da resposta é um objeto, retornando null:', value);
      return null;
    }
    
    return value;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    console.log('🔍 calculateResults chamado');
    
    // Verificar se o usuário está autenticado
    if (!user) {
      console.error('❌ Usuário não autenticado');
      alert('Para salvar seus resultados, você precisa estar logado. A avaliação será finalizada, mas os resultados não serão salvos.');
      console.log('🔍 Continuando sem autenticação...');
    } else {
      console.log('✅ Usuário autenticado:', user.email);
    }

    const results = {
      userId: user?.id || 'anonymous',
      userEmail: user?.email || 'anonymous@example.com',
      categories: {
        Emocional: 0,
        Autocrítica: 0,
        "Comportamento Alimentar": 0,
        "Imagem Corporal": 0
      },
      totalScore: 0,
      insights: [],
      recommendations: [],
      completedAt: new Date().toISOString()
    };

    console.log('🔍 Respostas coletadas:', answers);

    // Calcular pontuações por categoria
    answers.forEach(answer => {
      if (answer.value !== undefined && answer.value !== null) {
        if (answer.category === "Emocional") {
          results.categories.Emocional += Number(answer.value);
        } else if (answer.category === "Autocrítica") {
          results.categories.Autocrítica += Number(answer.value);
        } else if (answer.category === "Comportamento Alimentar") {
          results.categories["Comportamento Alimentar"] += Number(answer.value);
        } else if (answer.category === "Imagem Corporal") {
          results.categories["Imagem Corporal"] += Number(answer.value);
        }
      }
    });

    // Calcular pontuação total
    results.totalScore = Object.values(results.categories).reduce((sum, score) => sum + score, 0);

    // Gerar insights
    Object.entries(results.categories).forEach(([category, score]) => {
      if (score > 7) {
        results.insights.push(`Alta influência de ${category.toLowerCase()}`);
      } else if (score > 4) {
        results.insights.push(`Influência moderada de ${category.toLowerCase()}`);
      } else {
        results.insights.push(`Baixa influência de ${category.toLowerCase()}`);
      }
    });

    // Gerar recomendações baseadas nos resultados
    if (results.categories.Emocional > 7) {
      results.recommendations.push('Considere trabalhar com técnicas de mindfulness e identificação de gatilhos emocionais');
    }
    if (results.categories.Autocrítica > 7) {
      results.recommendations.push('Pratique autocompaixão e estabeleça metas mais realistas');
    }
    if (results.categories["Comportamento Alimentar"] > 7) {
      results.recommendations.push('Desenvolva estratégias para lidar com o estresse sem recorrer à comida');
    }
    if (results.categories["Imagem Corporal"] > 7) {
      results.recommendations.push('Trabalhe na aceitação corporal e foque em saúde, não apenas em aparência');
    }

    console.log('🔍 Resultados calculados:', results);
    setIsCompleted(true);
    console.log('🔍 Chamando onComplete...');
    onComplete(results);
    console.log('🔍 onComplete chamado com sucesso');
  };

  const renderQuestion = () => {
    const currentAnswer = getCurrentAnswer();

    // Adicionar botão de lixeira para a pergunta atual
    const renderLixeiraButton = () => (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => moverParaLixeira(currentQ.id)}
        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-1"
        title="Mover para lixeira de segurança"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );

    switch (currentQ.type) {
      case 'scale':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-netflix-text flex-1">
                  {currentQ.text}
                </h3>
                {renderLixeiraButton()}
              </div>
              <div className="flex justify-between text-sm text-netflix-text-muted mb-2">
                <span>{currentQ.options.min_label}</span>
                <span>{currentQ.options.max_label}</span>
              </div>
              <Slider
                value={[Number(currentAnswer) || currentQ.options.min]}
                onValueChange={(value) => handleAnswer(value[0])}
                min={currentQ.options.min}
                max={currentQ.options.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-netflix-text-muted mt-2">
                {currentQ.options.show_numbers && (
                  <>
                    <span>{currentQ.options.min}</span>
                    <span>{Number(currentAnswer) || currentQ.options.min}</span>
                    <span>{currentQ.options.max}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-netflix-text flex-1">
                {currentQ.text}
              </h3>
              {renderLixeiraButton()}
            </div>
            <div className="space-y-3">
              {currentQ.options.choices.map((choice: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  {currentQ.options.single_selection ? (
                    <RadioGroup
                      value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                      onValueChange={(value) => {
                        handleAnswer(value);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={choice} id={`choice-${index}`} />
                        <Label htmlFor={`choice-${index}`} className="text-netflix-text cursor-pointer">
                          {choice}
                        </Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`choice-${index}`}
                        checked={Array.isArray(currentAnswer) && currentAnswer.includes(choice)}
                        onCheckedChange={(checked) => {
                          const newValue = Array.isArray(currentAnswer) ? currentAnswer : [];
                          if (checked) {
                            handleAnswer([...newValue, choice]);
                          } else {
                            handleAnswer(newValue.filter((item: string) => item !== choice));
                          }
                        }}
                        className="border-netflix-border data-[state=checked]:bg-netflix-red"
                      />
                      <Label htmlFor={`choice-${index}`} className="text-netflix-text cursor-pointer">
                        {choice}
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'matrix':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-netflix-text flex-1">
                {currentQ.text}
              </h3>
              {renderLixeiraButton()}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-netflix-border p-2 text-left text-netflix-text"></th>
                    {currentQ.options.columns.map((col: string, index: number) => (
                      <th key={index} className="border border-netflix-border p-2 text-center text-netflix-text">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentQ.options.rows.map((row: string, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td className="border border-netflix-border p-2 text-netflix-text font-medium">
                        {row}
                      </td>
                      {currentQ.options.columns.map((col: string, colIndex: number) => (
                        <td key={colIndex} className="border border-netflix-border p-2 text-center">
                          <RadioGroup
                            value={typeof currentAnswer === 'object' && currentAnswer !== null ? (currentAnswer[row] || '') : ''}
                            onValueChange={(value) => {
                              const newValue = typeof currentAnswer === 'object' && currentAnswer !== null 
                                ? { ...currentAnswer, [row]: value }
                                : { [row]: value };
                              handleAnswer(newValue);
                            }}
                          >
                            <RadioGroupItem 
                              value={col} 
                              id={`${row}-${col}`}
                              className="border-netflix-border data-[state=checked]:bg-netflix-red"
                            />
                          </RadioGroup>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'image_selection':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-netflix-text flex-1">
                {currentQ.text}
              </h3>
              {renderLixeiraButton()}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentQ.options.images.map((image: any, index: number) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    currentAnswer?.includes(image.label)
                      ? 'border-netflix-red bg-netflix-red/10'
                      : 'border-netflix-border hover:border-netflix-red/50'
                  }`}
                  onClick={() => {
                    const newValue = currentAnswer || [];
                    const isSelected = newValue.includes(image.label);
                    const updatedValue = isSelected
                      ? newValue.filter((item: string) => item !== image.label)
                      : [...newValue, image.label];
                    handleAnswer(updatedValue);
                  }}
                >
                  <div className="aspect-square bg-netflix-gray rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-netflix-text-muted" />
                  </div>
                  {currentQ.options.show_labels && (
                    <p className="text-sm text-netflix-text mt-2 text-center">{image.label}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'drawing':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-netflix-text flex-1">
                {currentQ.text}
              </h3>
              {renderLixeiraButton()}
            </div>
            <div className="border-2 border-dashed border-netflix-border rounded-lg p-8 text-center">
              <Palette className="h-12 w-12 text-netflix-text-muted mx-auto mb-4" />
              <p className="text-netflix-text-muted mb-4">
                Área de desenho - Funcionalidade em desenvolvimento
              </p>
              <Textarea
                placeholder="Descreva como você se sente em relação ao seu corpo..."
                value={currentAnswer || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="bg-netflix-gray border-netflix-border text-netflix-text"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return <div>Tipo de pergunta não suportado</div>;
    }
  };

  if (isCompleted) {
    return (
      <Card className="bg-netflix-card border-netflix-border">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-netflix-text mb-2">
            Avaliação Concluída!
          </h3>
          <p className="text-netflix-text-muted">
            Suas respostas foram salvas e os resultados estão sendo processados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interface de Gerenciamento da Lixeira */}
      {mostrarLixeira && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-orange-800">
              <div className="flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-orange-600" />
                Lixeira de Segurança
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMostrarLixeira(false)}
                  className="text-orange-600 border-orange-300"
                >
                  Fechar
                </Button>
                <Button
                  size="sm"
                  onClick={limparLixeira}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Limpar Tudo
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPerguntasNaLixeira().length === 0 ? (
                <p className="text-orange-600 text-center py-4">Lixeira vazia</p>
              ) : (
                getPerguntasNaLixeira().map((pergunta) => (
                  <div key={pergunta.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{pergunta.texto}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {pergunta.categoria}
                        </Badge>
                        <span className="text-xs text-orange-600">
                          Excluída em: {pergunta.dataExclusao?.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restaurarDaLixeira(pergunta.id)}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restaurar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => excluirDefinitivamente(pergunta.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-netflix-red" />
              <CardTitle className="text-netflix-text">
                Sabotadores do Emagrecimento
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {perguntasAtivas.length} perguntas ativas
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMostrarLixeira(!mostrarLixeira)}
                className="text-orange-600 border-orange-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Lixeira ({getPerguntasNaLixeira().length})
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {renderQuestion()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <Button
              onClick={currentQuestion === questions.length - 1 ? calculateResults : handleNext}
              className="bg-netflix-red text-white hover:bg-netflix-red/90 border-none"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar
                </>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 