import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Target, Clock, Settings, Play, Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import butterflyLogo from '@/assets/butterfly-logo.png';

const FullSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);

  // Sample session data (same as before but now full access)
  const sessions = [
    {
      id: 1,
      title: "Descobrindo Seus Sabotadores Internos",
      description: "Uma sessão completa sobre como identificar padrões mentais que limitam seu crescimento.",
      estimated_duration: "15 min",
      content: JSON.stringify({
        intro: "Bem-vindo a esta jornada completa de autoconhecimento. Nesta sessão, você vai descobrir os padrões mentais que podem estar limitando seu crescimento pessoal e aprenderá estratégias práticas para superá-los.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Identifique Seus Padrões",
            description: "Reflita sobre situações em que você se sabotou ou limitou suas próprias oportunidades. Descreva pelo menos 3 situações específicas."
          },
          {
            title: "Reconheça os Gatilhos",
            description: "Quais situações ou emoções costumam ativar esses padrões limitantes? Como você se sente fisicamente quando isso acontece?"
          },
          {
            title: "Visualize a Mudança",
            description: "Como seria sua vida se você conseguisse superar esses sabotadores internos? Seja específico sobre os resultados que gostaria de alcançar."
          },
          {
            title: "Estratégias de Superação",
            description: "Baseado no que descobriu, quais são 3 estratégias práticas que você pode implementar quando perceber esses padrões?"
          }
        ],
        conclusion: "Parabéns por completar esta sessão! O autoconhecimento é o primeiro passo para a transformação. Continue praticando a observação de seus padrões para desenvolver mais consciência sobre si mesmo."
      })
    },
    {
      id: 2,
      title: "Primeiros Passos da Transformação",
      description: "Aprenda as bases completas da metodologia do Instituto dos Sonhos.",
      estimated_duration: "25 min",
      content: JSON.stringify({
        intro: "Esta é uma sessão fundamental para entender nossa metodologia completa de transformação pessoal. Você aprenderá todos os pilares que sustentam uma mudança duradoura.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Defina Sua Visão Completa",
            description: "Descreva detalhadamente como você gostaria que sua vida fosse em 12 meses. Include aspectos pessoais, profissionais, relacionamentos e saúde."
          },
          {
            title: "Mapeie Obstáculos",
            description: "Liste todos os principais desafios que você enfrenta atualmente. Categorize-os entre internos (crenças, medos) e externos (circunstâncias)."
          },
          {
            title: "Plano de Ação Detalhado",
            description: "Crie um plano com 5 ações específicas que você pode tomar nas próximas 2 semanas para se aproximar da sua visão."
          },
          {
            title: "Rede de Apoio e Recursos",
            description: "Identifique pessoas, livros, cursos ou recursos que podem te apoiar nesta jornada. Como você vai ativar essa rede?"
          }
        ],
        conclusion: "Excelente trabalho! Você criou uma base sólida para sua jornada de transformação. Lembre-se: grandes mudanças começam com pequenas ações consistentes."
      })
    },
    {
      id: 3,
      title: "Respiração Consciente para Ansiedade",
      description: "Técnicas completas de respiração e regulação emocional.",
      estimated_duration: "18 min",
      content: JSON.stringify({
        intro: "A respiração é uma ferramenta poderosa para regular suas emoções e reduzir a ansiedade. Nesta sessão completa, você aprenderá múltiplas técnicas que pode usar em qualquer situação.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tasks: [
          {
            title: "Técnica 4-7-8 Avançada",
            description: "Pratique a respiração 4-7-8 por 10 ciclos. Descreva como se sentiu antes, durante e depois. Quais sensações físicas notou?"
          },
          {
            title: "Respiração do Quadrado Completa",
            description: "Pratique por 15 minutos: inspire por 4, segure por 4, expire por 4, segure por 4. Como esta técnica afeta seu estado mental?"
          },
          {
            title: "Situações de Aplicação",
            description: "Identifique 5 situações específicas da sua vida onde você pode usar essas técnicas. Como vai lembrar de aplicá-las?"
          }
        ],
        conclusion: "Parabéns por dominar essas técnicas! A respiração consciente é uma habilidade que melhora com a prática. Use essas técnicas diariamente para resultados duradouros."
      })
    }
  ];

  const session = sessions.find(s => s.id === parseInt(id || '1'));

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Sessão não encontrada.</p>
      </div>
    );
  }

  const sessionContent = typeof session.content === 'string' 
    ? JSON.parse(session.content) 
    : session.content;

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

  // Save progress for users (database)
  useEffect(() => {
    if (id && user) {
      const progress = (currentStep / (steps.length - 1)) * 100;
      // TODO: Save to database
      
      if (currentStep === steps.length - 1) {
        // TODO: Save completion to database
      }
    }
  }, [currentStep, id, user]);

  const handleResponseChange = (taskIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[taskIndex] = value;
    setResponses(newResponses);

    if (user) {
      // TODO: Auto-save to database for logged users
    }
  };

  const renderStep = () => {
    const step = currentStepData;
    
    switch (step.component) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-netflix-text mb-4">
                🌟 Bem-vindo à sua sessão completa
              </h2>
              <p className="text-lg text-netflix-text-muted leading-relaxed">
                {sessionContent.intro}
              </p>
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
          </div>
        );

      case 'task':
        const taskStep = step as any;
        const task = sessionContent.tasks[taskStep.taskIndex];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-netflix-text mb-4">{task.title}</h3>
              <p className="text-netflix-text-muted/70 mb-6">{task.description}</p>
            </div>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-netflix-text">Sua Resposta:</h4>
              </div>
              <Textarea 
                placeholder="Digite sua resposta aqui..."
                className="min-h-[150px] resize-none"
                value={responses[taskStep.taskIndex] || ''}
                onChange={(e) => handleResponseChange(taskStep.taskIndex, e.target.value)}
              />
            </Card>
          </div>
        );

      case 'conclusion':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-netflix-text mb-4">
                🎉 Sessão Concluída com Sucesso!
              </h2>
              <p className="text-lg text-netflix-text-muted">
                Parabéns por completar esta jornada de autoconhecimento
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-netflix-red/10 to-netflix-red/5 p-6 rounded-lg border border-netflix-red/20">
              <p className="text-lg text-netflix-text leading-relaxed text-center">
                {sessionContent.conclusion}
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="lg"
                className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
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
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-netflix-text"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
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
                  Sessão Completa
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
              <span>60 minutos</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Mentalidade Positiva</span>
            </div>
            <Badge variant="outline" className="border-netflix-red text-netflix-red">
              Completo
            </Badge>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-netflix-text-muted">Progresso</span>
            <span className="text-sm text-netflix-red font-semibold">3 de 4 tarefas</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>

        {/* Seção de Introdução */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-netflix-text mb-4">
            Sobre esta Sessão
          </h2>
          <p className="text-netflix-text-muted mb-6">
            Esta sessão completa foi desenvolvida para transformar sua mentalidade 
            e ajudá-lo a alcançar seus objetivos de forma sustentável.
          </p>
          
          <Card className="mt-6 border-netflix-red/20 bg-netflix-red/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-netflix-red mb-2">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Objetivo da Sessão</span>
              </div>
              <p className="text-sm text-netflix-text-muted">
                Desenvolver uma mentalidade positiva e resiliente através de 
                técnicas comprovadas e exercícios práticos.
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
                    <h4 className="font-semibold text-netflix-text">Sua Resposta:</h4>
                    <Badge variant="outline" className="text-xs border-netflix-red text-netflix-red">
                      Salvo automaticamente
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

        {/* Navegação */}
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
                  index < 3 ? 'bg-netflix-red' : 'bg-netflix-red/60'
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

    </div>
  );
};

export default FullSession;