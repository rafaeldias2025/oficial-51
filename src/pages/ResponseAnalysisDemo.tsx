import React, { useState, useEffect } from 'react';
import { ResponseAnalyzer } from '@/components/analysis/ResponseAnalyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Users, 
  TrendingUp, 
  Brain,
  Heart,
  Target,
  Lightbulb
} from 'lucide-react';

interface ResponseData {
  id: string;
  userId: string;
  userName: string;
  questionText: string;
  responseValue: number;
  responseText: string;
  category: string;
  questionNumber: number;
}

export const ResponseAnalysisDemo: React.FC = () => {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResponses: 0,
    totalUsers: 0,
    averageScore: 0,
    categories: [] as string[]
  });

  useEffect(() => {
    loadUserResponses();
  }, []);

  const loadUserResponses = async () => {
    try {
      // Simular dados de usuários baseados na análise anterior
      const mockResponses: ResponseData[] = [
        // Ana Costa - Relacionamentos
        {
          id: '1',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você constrói relacionamentos?',
          responseValue: 8,
          responseText: 'Genuinamente e com interesse',
          category: 'Relacionamentos',
          questionNumber: 1
        },
        {
          id: '2',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de empatia?',
          responseValue: 9,
          responseText: 'Alta empatia',
          category: 'Relacionamentos',
          questionNumber: 2
        },
        {
          id: '3',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você comunica?',
          responseValue: 8,
          responseText: 'Clara e objetiva',
          category: 'Relacionamentos',
          questionNumber: 3
        },
        {
          id: '4',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de escuta?',
          responseValue: 9,
          responseText: 'Escuta ativa',
          category: 'Relacionamentos',
          questionNumber: 4
        },
        {
          id: '5',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você resolve conflitos?',
          responseValue: 7,
          responseText: 'Diálogo construtivo',
          category: 'Relacionamentos',
          questionNumber: 5
        },
        {
          id: '6',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua assertividade?',
          responseValue: 8,
          responseText: 'Comunicação assertiva',
          category: 'Relacionamentos',
          questionNumber: 6
        },
        {
          id: '7',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você dá feedback?',
          responseValue: 9,
          responseText: 'Feedback construtivo',
          category: 'Relacionamentos',
          questionNumber: 7
        },
        {
          id: '8',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de influência?',
          responseValue: 7,
          responseText: 'Influência positiva',
          category: 'Relacionamentos',
          questionNumber: 8
        },
        {
          id: '9',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você trabalha em equipe?',
          responseValue: 8,
          responseText: 'Colaboração efetiva',
          category: 'Relacionamentos',
          questionNumber: 9
        },
        {
          id: '10',
          userId: 'ana-costa',
<<<<<<< HEAD
          userName: 'Ana Costa',
=======
          userName: 'Ana Costa - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de liderança?',
          responseValue: 6,
          responseText: 'Liderança em desenvolvimento',
          category: 'Relacionamentos',
          questionNumber: 10
        },

        // Maria Santos - Emocional
        {
          id: '11',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você se sente emocionalmente hoje?',
          responseValue: 7,
          responseText: 'Equilibrado',
          category: 'Emocional',
          questionNumber: 1
        },
        {
          id: '12',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual seu nível de estresse?',
          responseValue: 6,
          responseText: 'Moderado',
          category: 'Emocional',
          questionNumber: 2
        },
        {
          id: '13',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você lida com frustrações?',
          responseValue: 8,
          responseText: 'Análise e resolução',
          category: 'Emocional',
          questionNumber: 3
        },
        {
          id: '14',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de resiliência?',
          responseValue: 7,
          responseText: 'Boa',
          category: 'Emocional',
          questionNumber: 4
        },
        {
          id: '15',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você expressa emoções?',
          responseValue: 6,
          responseText: 'Abertamente',
          category: 'Emocional',
          questionNumber: 5
        },
        {
          id: '16',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual seu nível de ansiedade?',
          responseValue: 5,
          responseText: 'Baixo',
          category: 'Emocional',
          questionNumber: 6
        },
        {
          id: '17',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você pratica autocuidado?',
          responseValue: 8,
          responseText: 'Rotina diária',
          category: 'Emocional',
          questionNumber: 7
        },
        {
          id: '18',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de empatia?',
          responseValue: 9,
          responseText: 'Excelente',
          category: 'Emocional',
          questionNumber: 8
        },
        {
          id: '19',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você gerencia conflitos?',
          responseValue: 7,
          responseText: 'Diálogo construtivo',
          category: 'Emocional',
          questionNumber: 9
        },
        {
          id: '20',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual seu nível de autoconfiança?',
          responseValue: 8,
          responseText: 'Alto',
          category: 'Emocional',
          questionNumber: 10
        },

        // Maria Santos - Mental
        {
          id: '21',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você pratica mindfulness?',
          responseValue: 6,
          responseText: 'Meditação diária',
          category: 'Mental',
          questionNumber: 11
        },
        {
          id: '22',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua clareza mental?',
          responseValue: 8,
          responseText: 'Muito boa',
          category: 'Mental',
          questionNumber: 12
        },
        {
          id: '23',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você mantém foco?',
          responseValue: 7,
          responseText: 'Técnicas específicas',
          category: 'Mental',
          questionNumber: 13
        },
        {
          id: '24',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua capacidade de decisão?',
          responseValue: 8,
          responseText: 'Rápida e assertiva',
          category: 'Mental',
          questionNumber: 14
        },
        {
          id: '25',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você processa informações?',
          responseValue: 9,
          responseText: 'Análise detalhada',
          category: 'Mental',
          questionNumber: 15
        },
        {
          id: '26',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua criatividade?',
          responseValue: 7,
          responseText: 'Boa',
          category: 'Mental',
          questionNumber: 16
        },
        {
          id: '27',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você resolve problemas?',
          responseValue: 8,
          responseText: 'Método sistemático',
          category: 'Mental',
          questionNumber: 17
        },
        {
          id: '28',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua memória?',
          responseValue: 6,
          responseText: 'Regular',
          category: 'Mental',
          questionNumber: 18
        },
        {
          id: '29',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Como você aprende?',
          responseValue: 9,
          responseText: 'Múltiplas estratégias',
          category: 'Mental',
          questionNumber: 19
        },
        {
          id: '30',
          userId: 'maria-santos',
<<<<<<< HEAD
          userName: 'Maria Santos',
=======
          userName: 'Maria Santos - Instituto dos Sonhos',
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
          questionText: 'Qual sua curiosidade intelectual?',
          responseValue: 8,
          responseText: 'Alta',
          category: 'Mental',
          questionNumber: 20
        }
      ];

      setResponses(mockResponses);

      // Calcular estatísticas
      const uniqueUsers = [...new Set(mockResponses.map(r => r.userId))];
      const uniqueCategories = [...new Set(mockResponses.map(r => r.category))];
      const averageScore = mockResponses.reduce((sum, r) => sum + r.responseValue, 0) / mockResponses.length;

      setStats({
        totalResponses: mockResponses.length,
        totalUsers: uniqueUsers.length,
        averageScore: averageScore,
        categories: uniqueCategories
      });

    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando análise de respostas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
<<<<<<< HEAD
          📊 Análise de Respostas 
=======
          📊 Análise de Respostas - Instituto dos Sonhos
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sistema inteligente de análise de respostas que identifica padrões, 
          forças e áreas de desenvolvimento dos usuários
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalResponses}</p>
                <p className="text-sm text-gray-600">Total de Respostas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Usuários Analisados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Pontuação Média</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.categories.length}</p>
                <p className="text-sm text-gray-600">Categorias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.categories.map((category) => {
          const categoryResponses = responses.filter(r => r.category === category);
          const avgScore = categoryResponses.reduce((sum, r) => sum + r.responseValue, 0) / categoryResponses.length;
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category === 'Relacionamentos' && <Heart className="w-5 h-5 text-pink-500" />}
                  {category === 'Emocional' && <Brain className="w-5 h-5 text-blue-500" />}
                  {category === 'Mental' && <Target className="w-5 h-5 text-purple-500" />}
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Média</span>
                    <span className="font-semibold">{avgScore.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Respostas</span>
                    <span className="font-semibold">{categoryResponses.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(avgScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analysis Component */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ResponseAnalyzer responses={responses} />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Recursos Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Análise automática de padrões</li>
              <li>• Identificação de forças e fraquezas</li>
              <li>• Recomendações personalizadas</li>
              <li>• Comparação entre usuários</li>
              <li>• Relatórios detalhados</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Insights Valiosos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Perfis comportamentais</li>
              <li>• Tendências de desenvolvimento</li>
              <li>• Áreas de melhoria</li>
              <li>• Potencial de crescimento</li>
              <li>• Estratégias personalizadas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 