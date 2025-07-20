import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Download,
  Eye,
  FileText,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AnamneseResult {
  id: string;
  testId: string;
  testName: string;
  clientName: string;
  clientEmail: string;
  completedAt: string;
  totalScore: number;
  categoryScores: {
    [key: string]: number;
  };
  responses: {
    questionId: string;
    question: string;
    answer: string;
    category: string;
  }[];
  recommendations: string[];
}

const mockResults: AnamneseResult[] = [
  {
    id: '1',
    testId: '1',
    testName: 'Sabotadores do Emagrecimento',
    clientName: 'Maria Silva',
    clientEmail: 'maria@email.com',
    completedAt: '2024-01-15T10:30:00Z',
    totalScore: 65,
    categoryScores: {
      'Comportamental': 70,
      'Emocional': 60,
      'Ambiental': 75,
      'Cognitivo': 55
    },
    responses: [
      {
        questionId: '1.1',
        question: 'Você come quando está ansioso(a) ou estressado(a)?',
        answer: 'Frequentemente',
        category: 'Comportamental'
      },
      {
        questionId: '1.2',
        question: 'Você come por hábito, mesmo sem fome?',
        answer: 'Às vezes',
        category: 'Comportamental'
      }
    ],
    recommendations: [
      'Desenvolver técnicas de mindfulness para controle emocional',
      'Criar rotinas alimentares estruturadas',
      'Identificar gatilhos emocionais para alimentação',
      'Praticar alimentação consciente'
    ]
  },
  {
    id: '2',
    testId: '2',
    testName: 'Necessidades Humanas',
    clientName: 'João Santos',
    clientEmail: 'joao@email.com',
    completedAt: '2024-01-14T14:20:00Z',
    totalScore: 78,
    categoryScores: {
      'Fisiológica': 80,
      'Segurança': 75,
      'Social': 70,
      'Estima': 85,
      'Autorrealização': 80
    },
    responses: [
      {
        questionId: '2.1',
        question: 'Como você avalia sua qualidade do sono?',
        answer: '8',
        category: 'Fisiológica'
      },
      {
        questionId: '2.2',
        question: 'Como você avalia sua alimentação?',
        answer: '7',
        category: 'Fisiológica'
      }
    ],
    recommendations: [
      'Focar no desenvolvimento de relacionamentos sociais',
      'Trabalhar na autoestima e autoconfiança',
      'Explorar novos hobbies e interesses',
      'Definir metas de desenvolvimento pessoal'
    ]
  },
  {
    id: '3',
    testId: '3',
    testName: 'Estados Emocionais',
    clientName: 'Ana Costa',
    clientEmail: 'ana@email.com',
    completedAt: '2024-01-13T09:15:00Z',
    totalScore: 45,
    categoryScores: {
      'Positivo': 40,
      'Negativo': 60,
      'Neutro': 50,
      'Gatilhos': 45
    },
    responses: [
      {
        questionId: '3.1',
        question: 'Com que frequência você se sente feliz?',
        answer: 'Às vezes',
        category: 'Positivo'
      },
      {
        questionId: '3.2',
        question: 'Com que frequência você se sente motivado(a)?',
        answer: 'Raramente',
        category: 'Positivo'
      }
    ],
    recommendations: [
      'Praticar técnicas de gestão de estresse',
      'Desenvolver rotinas de autocuidado',
      'Buscar apoio profissional se necessário',
      'Criar momentos de alegria e gratidão'
    ]
  },
  {
    id: '4',
    testId: '4',
    testName: 'Sabotadores Plus',
    clientName: 'Pedro Lima',
    clientEmail: 'pedro@email.com',
    completedAt: '2024-01-12T16:45:00Z',
    totalScore: 58,
    categoryScores: {
      'Produtividade': 55,
      'Relacionamentos': 60,
      'Saúde Mental': 50,
      'Desenvolvimento': 65
    },
    responses: [
      {
        questionId: '4.1',
        question: 'Você procrastina tarefas importantes?',
        answer: 'Frequentemente',
        category: 'Produtividade'
      },
      {
        questionId: '4.2',
        question: 'Você se distrai facilmente durante o trabalho?',
        answer: 'Às vezes',
        category: 'Produtividade'
      }
    ],
    recommendations: [
      'Implementar técnicas de produtividade (Pomodoro)',
      'Desenvolver habilidades de comunicação',
      'Praticar mindfulness e meditação',
      'Estabelecer metas realistas e celebrar conquistas'
    ]
  }
];

export const AnamneseResults: React.FC = () => {
  const [results, setResults] = useState<AnamneseResult[]>(mockResults);
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<AnamneseResult | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa Melhorar';
  };

  const filteredResults = selectedTest === 'all' 
    ? results 
    : results.filter(result => result.testId === selectedTest);

  const testNames = [
    { id: 'all', name: 'Todos os Testes' },
    { id: '1', name: 'Sabotadores do Emagrecimento' },
    { id: '2', name: 'Necessidades Humanas' },
    { id: '3', name: 'Estados Emocionais' },
    { id: '4', name: 'Sabotadores Plus' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resultados de Anamnese</h2>
            <p className="text-gray-600">Análise dos questionários respondidos pelos clientes</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Avaliações</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(results.map(r => r.clientEmail)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Média de Pontuação</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.filter(r => {
                    const date = new Date(r.completedAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <Select value={selectedTest} onValueChange={setSelectedTest}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por teste" />
              </SelectTrigger>
              <SelectContent>
                {testNames.map(test => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResults.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{result.clientName}</CardTitle>
                  <p className="text-sm text-gray-600">{result.clientEmail}</p>
                  <Badge className="mt-2">{result.testName}</Badge>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(result.totalScore)}`}>
                    {result.totalScore}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getScoreLabel(result.totalScore)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Data:</span>
                  <span>{new Date(result.completedAt).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pontuação por Categoria:</p>
                  <div className="space-y-1">
                    {Object.entries(result.categoryScores).map(([category, score]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{category}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResult(result)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Result Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedResult.clientName}</h3>
                <p className="text-gray-600">{selectedResult.testName}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedResult(null)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Score Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pontuação Total</p>
                      <p className={`text-2xl font-bold ${getScoreColor(selectedResult.totalScore)}`}>
                        {selectedResult.totalScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-lg font-medium">{getScoreLabel(selectedResult.totalScore)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Pontuação por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(selectedResult.categoryScores).map(([category, score]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Responses */}
              <Card>
                <CardHeader>
                  <CardTitle>Respostas Detalhadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedResult.responses.map((response, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{response.question}</p>
                            <p className="text-gray-600 mt-1">Resposta: <span className="font-medium">{response.answer}</span></p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {response.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 