import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useVisitorData } from '@/hooks/useVisitorData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Play, Pause, CheckCircle, Lock, Clock, Users, Crown, Sparkles, Heart, Eye, Target, Video, Brain, Settings, Star } from 'lucide-react';
import ConversionCTA from '@/components/ConversionCTA';
import butterflyLogo from '@/assets/butterfly-logo.png';

const SampleSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const { saveSessionProgress, saveSessionResponse, completeSession, addTimeSpent } = useVisitorData();

  // Sample session data
  const sessions = [
    {
      id: 1,
      title: "Descobrindo Seus Sabotadores Internos",
      description: "Uma sessão introdutória sobre como identificar padrões mentais que limitam seu crescimento.",
      estimated_duration: "15 min",
      content: JSON.stringify({
        intro: "Bem-vindo a esta jornada de autoconhecimento. Nesta sessão, você vai descobrir os padrões mentais que podem estar limitando seu crescimento pessoal.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Identifique Seus Padrões",
            description: "Reflita sobre situações em que você se sabotou ou limitou suas próprias oportunidades."
          },
          {
            title: "Reconheça os Gatilhos",
            description: "Quais situações ou emoções costumam ativar esses padrões limitantes?"
          },
          {
            title: "Visualize a Mudança",
            description: "Como seria sua vida se você conseguisse superar esses sabotadores internos?"
          }
        ],
        conclusion: "Parabéns por completar esta sessão introdutória! O autoconhecimento é o primeiro passo para a transformação. Continue praticando a observação de seus padrões para desenvolver mais consciência sobre si mesmo."
      })
    },
    {
      id: 2,
      title: "Primeiros Passos da Transformação",
      description: "Aprenda as bases da metodologia do Instituto dos Sonhos e comece sua jornada.",
      estimated_duration: "20 min",
      content: JSON.stringify({
        intro: "Esta é uma sessão fundamental para entender nossa metodologia única de transformação pessoal. Você aprenderá os pilares básicos que sustentam uma mudança duradoura.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Defina Sua Visão",
            description: "Descreva como você gostaria que sua vida fosse em 12 meses."
          },
          {
            title: "Identifique Obstáculos",
            description: "Quais são os principais desafios que você enfrenta atualmente?"
          },
          {
            title: "Primeiro Compromisso",
            description: "Que pequena ação você pode tomar hoje para se aproximar da sua visão?"
          },
          {
            title: "Rede de Apoio",
            description: "Quem são as pessoas que podem te apoiar nesta jornada?"
          }
        ],
        conclusion: "Excelente trabalho! Você deu os primeiros passos importantes na sua jornada de transformação. Lembre-se: grandes mudanças começam com pequenas ações consistentes."
      })
    },
    {
      id: 3,
      title: "Respiração Consciente para Ansiedade",
      description: "Técnicas práticas de respiração para momentos de estresse e ansiedade.",
      estimated_duration: "12 min",
      content: JSON.stringify({
        intro: "A respiração é uma ferramenta poderosa para regular suas emoções e reduzir a ansiedade. Nesta sessão prática, você aprenderá técnicas simples que pode usar em qualquer lugar.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Técnica 4-7-8",
            description: "Pratique a respiração 4-7-8: inspire por 4, segure por 7, expire por 8. Como se sentiu?"
          },
          {
            title: "Respiração do Quadrado",
            description: "Inspire por 4, segure por 4, expire por 4, segure por 4. Repita 5 vezes e observe as sensações."
          }
        ],
        conclusion: "Parabéns por praticar essas técnicas! A respiração consciente é uma habilidade que melhora com a prática. Use essas técnicas sempre que precisar de um momento de calma."
      })
    }
  ];

  const session = sessions.find(s => s.id === parseInt(id || '1'));

  if (!session) return null;

  // Parse content if it's a string
  const sessionContent = typeof session.content === 'string' 
    ? JSON.parse(session.content) 
    : session.content;

  // Ensure tasks exist
  if (!sessionContent?.tasks) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Conteúdo da sessão não disponível.</p>
    </div>;
  }

  // Define steps before useEffect
  const steps = [
    { name: 'Introdução', component: 'intro' },
    { name: 'Vídeo', component: 'video' },
    ...sessionContent.tasks.map((task, index) => ({
      name: `Tarefa ${index + 1}`,
      component: 'task',
      taskIndex: index
    })),
    { name: 'Conclusão', component: 'conclusion' }
  ];

  const currentStepData = steps[currentStep];

  // Track time spent (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      addTimeSpent(0.5); // Add 30 seconds every 30 seconds
    }, 30000);

    return () => clearInterval(interval);
  }, [addTimeSpent]);

  // Save progress when step changes
  useEffect(() => {
    if (id) {
      const progress = (currentStep / (steps.length - 1)) * 100;
      saveSessionProgress(id, progress);
      
      // Complete session if on last step
      if (currentStep === steps.length - 1) {
        completeSession(id);
      }
    }
  }, [currentStep, id, saveSessionProgress, completeSession, steps.length]);

  const renderStep = () => {
    const step = currentStepData;
    
    switch (step.component) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-netflix-text mb-4">
                🌟 Bem-vindo à sua sessão de transformação
              </h2>
              <p className="text-lg text-netflix-text-muted leading-relaxed">
                {sessionContent.intro}
              </p>
              
              <Card className="mt-6 border-netflix-red/20 bg-netflix-red/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-netflix-red mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">Amostra Limitada</span>
                  </div>
                  <p className="text-sm text-netflix-text-muted">
                    Esta é uma versão resumida. A sessão completa inclui exercícios interativos, 
                    reflexões guiadas e materiais extras.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-netflix-red/10 p-6 rounded-lg border border-netflix-red/20">
              <h3 className="font-semibold text-netflix-text mb-2">O que você vai descobrir:</h3>
              <ul className="space-y-2 text-netflix-text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-netflix-red" />
                  Como identificar padrões limitantes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-netflix-red" />
                  Técnicas de autoconhecimento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-netflix-red" />
                  Primeiros passos para a transformação
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-netflix-red" />
                  <span className="text-netflix-red">Exercícios práticos (versão completa)</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-netflix-text mb-4">
              🎥 Conteúdo Principal
            </h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={sessionContent.video_url}
                title={session.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <ConversionCTA 
              variant="inline"
              message="Na versão completa, você tem acesso a vídeos exclusivos com o Rafael e materiais complementares."
              className="mt-4"
            />
          </div>
        );

      case 'task':
        const taskStep = step as any;
        const task = sessionContent.tasks[taskStep.taskIndex];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-netflix-text mb-4">{task.title}</h3>
              <p className="text-netflix-text-muted mb-6">{task.description}</p>
            </div>
            
            <Card className="p-6 bg-netflix-red/5 border border-netflix-red/20">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-netflix-text">Espaço para Reflexão:</h4>
                <Badge variant="outline" className="text-xs border-netflix-red text-netflix-red">
                  <Eye className="w-3 h-3 mr-1" />
                  Opcional
                </Badge>
              </div>
              <Textarea 
                placeholder="💭 Na versão completa, você poderia salvar suas reflexões e acompanhar seu progresso..."
                className="min-h-[120px] resize-none bg-white/50"
                value={responses[taskStep.taskIndex] || ''}
                onChange={(e) => {
                  const newResponses = [...responses];
                  newResponses[taskStep.taskIndex] = e.target.value;
                  setResponses(newResponses);
                }}
                disabled
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-netflix-text-muted">
                  💡 Dica: Na versão completa, suas respostas são salvas automaticamente
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="bg-netflix-red hover:bg-netflix-red/90"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Desbloquear
                </Button>
              </div>
            </Card>

            <ConversionCTA 
              variant="inline"
              message="Quer salvar suas reflexões e acessar exercícios personalizados?"
              className="mt-4"
            />
          </div>
        );

      case 'conclusion':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-netflix-text mb-4">
                🎉 Parabéns! Amostra Concluída
              </h2>
              <p className="text-lg text-netflix-text-muted">
                Você experimentou uma pequena amostra do poder das nossas sessões
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-netflix-red/10 to-netflix-red/5 p-6 rounded-lg border border-netflix-red/20">
              <p className="text-lg text-netflix-text leading-relaxed text-center">
                {sessionContent.conclusion}
              </p>
            </div>

            <ConversionCTA 
              message="Gostou desta amostra? Membros registrados têm acesso a +100 sessões completas, exercícios interativos e acompanhamento personalizado do Rafael."
              className="my-6"
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/visitor-sessions')}
                variant="outline"
                size="lg"
                className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Explorar Outras Amostras
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-netflix-red hover:bg-netflix-red/90"
              >
                <Crown className="w-4 h-4 mr-2" />
                Desbloquear Conteúdo Completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Conteúdo não encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-light via-white to-netflix-cream">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-netflix-text">Instituto dos Sonhos</h1>
                <Badge variant="outline" className="text-xs border-netflix-red text-netflix-red">
                  <Eye className="w-3 h-3 mr-1" />
                  Modo Visitante
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/visitor-sessions')}
                className="text-netflix-text"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-netflix-red hover:bg-netflix-red/90"
              >
                <Crown className="w-4 h-4 mr-2" />
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Header da Sessão */}
        <div className="bg-netflix-card border-b border-netflix-border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-netflix-text">Instituto dos Sonhos</h1>
                <Badge variant="outline" className="text-xs border-netflix-red text-netflix-red">
                  Sessão de Amostra
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                className="border-netflix-border text-netflix-text"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                className="bg-netflix-red hover:bg-netflix-red/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Sessão
              </Button>
            </div>
          </div>
        </div>

        {/* Informações da Sessão */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-netflix-text mb-2">{session.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-netflix-text-muted">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>45 minutos</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Mentalidade Positiva</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Nível: Iniciante</span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-netflix-text-muted">Progresso da Amostra</span>
            <span className="text-sm text-netflix-red font-semibold">2 de 4 tarefas</span>
          </div>
          <Progress value={50} className="h-2" />
        </div>

        {/* Seção de Introdução */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-netflix-text mb-4">
            Sobre esta Sessão
          </h2>
          <p className="text-netflix-text-muted mb-6">
            Esta sessão foi cuidadosamente desenvolvida para ajudá-lo a desenvolver 
            uma mentalidade mais positiva e resiliente.
          </p>
          
          <Card className="mt-6 border-netflix-red/20 bg-netflix-red/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-netflix-red mb-2">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Objetivo da Sessão</span>
              </div>
              <p className="text-sm text-netflix-text-muted">
                Desenvolver técnicas práticas para transformar pensamentos negativos 
                em perspectivas mais construtivas e motivadoras.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Seção de Benefícios */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-netflix-text mb-4">
            O que você vai descobrir:
          </h2>
          
          <div className="bg-netflix-red/10 p-6 rounded-lg border border-netflix-red/20">
            <h3 className="font-semibold text-netflix-text mb-2">O que você vai descobrir:</h3>
            <ul className="space-y-2 text-netflix-text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-netflix-red" />
                Como identificar padrões de pensamento negativo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-netflix-red" />
                Técnicas para reestruturar pensamentos limitantes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-netflix-red" />
                Estratégias para manter uma mentalidade positiva
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-netflix-red" />
                Ferramentas práticas para o dia a dia
              </li>
            </ul>
          </div>
        </section>

        {/* Seção de Recursos */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-netflix-text mb-4">
            Recursos Inclusos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Video className="w-8 h-8 text-netflix-red" />
                  <div>
                    <h4 className="font-semibold text-netflix-text">Vídeo Introdutório</h4>
                    <p className="text-sm text-netflix-text-muted">15 minutos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-netflix-red" />
                  <span className="text-netflix-red">Exercícios práticos (versão completa)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção de Tarefas */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-netflix-text mb-4">
            Tarefas da Sessão
          </h2>
          
          {sessionContent.tasks.map((task, index) => (
            <Card key={index} className="mb-6 bg-netflix-card border-netflix-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-netflix-text mb-4">{task.title}</h3>
                <p className="text-netflix-text-muted mb-6">{task.description}</p>
                
                <Card className="p-6 bg-netflix-red/5 border border-netflix-red/20">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-netflix-text">Espaço para Reflexão:</h4>
                    <Badge variant="outline" className="text-xs border-netflix-red text-netflix-red">
                      Opcional
                    </Badge>
                    <textarea 
                      className="w-full mt-3 p-3 bg-netflix-card border border-netflix-border rounded-lg text-netflix-text placeholder-netflix-text-muted resize-none"
                      rows={4}
                      placeholder="Escreva suas reflexões aqui..."
                    />
                  </CardContent>
                </Card>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-netflix-text-muted" />
                    <p className="text-xs text-netflix-text-muted">
                      Tempo estimado: {task.duration}
                    </p>
                  </div>
                  <Button 
                    className="bg-netflix-red hover:bg-netflix-red/90"
                  >
                    Marcar como Concluída
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Seção de Conclusão */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-netflix-text mb-4">
            Próximos Passos
          </h2>
          
          <p className="text-lg text-netflix-text-muted">
            Após completar esta sessão, você terá uma base sólida para 
            desenvolver uma mentalidade mais positiva e resiliente.
          </p>
          
          <div className="bg-gradient-to-r from-netflix-red/10 to-netflix-red/5 p-6 rounded-lg border border-netflix-red/20">
            <p className="text-lg text-netflix-text leading-relaxed text-center">
              "A mudança começa com um único pensamento. 
              Cada escolha que você faz hoje molda o amanhã que você deseja."
            </p>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button 
              variant="outline"
              className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              className="bg-netflix-red hover:bg-netflix-red/90"
            >
              Continuar para Próxima Sessão
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Conversion Banner */}
        <ConversionCTA 
          variant="banner" 
          message="🎯 Você está visualizando uma amostra"
          className="mb-8"
        />

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline"
            className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex gap-2">
            {sessionContent.tasks.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < 2 ? 'bg-netflix-red' : 'bg-netflix-red/60'
                }`}
              />
            ))}
          </div>
          
          <Button 
            className="bg-netflix-red hover:bg-netflix-red/90"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Floating CTA */}
      <ConversionCTA variant="floating" />
    </div>
  );
};

export default SampleSession;