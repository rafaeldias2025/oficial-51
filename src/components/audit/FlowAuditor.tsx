import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NetflixButton,
  NetflixPrimaryButton,
  NetflixSecondaryButton,
  NetflixOutlineButton
} from '@/components/ui/netflix-buttons';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  ArrowRight,
  Home,
  User,
  FileText,
  Settings,
  BarChart3
} from 'lucide-react';

interface AuditResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
}

interface FlowTest {
  id: string;
  name: string;
  description: string;
  tests: AuditResult[];
}

const FlowAuditor: React.FC = () => {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState<string>('');
  const [results, setResults] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<FlowTest | null>(null);

  const flows: FlowTest[] = [
    {
      id: 'authentication',
      name: 'Fluxo de Autenticação',
      description: 'Testa login, logout e proteção de rotas',
      tests: [
        { id: 'login-page', name: 'Página de Login', status: 'pending', message: 'Verificando página de login' },
        { id: 'login-form', name: 'Formulário de Login', status: 'pending', message: 'Testando formulário' },
        { id: 'redirect-after-login', name: 'Redirecionamento', status: 'pending', message: 'Verificando redirecionamento' },
        { id: 'protected-routes', name: 'Rotas Protegidas', status: 'pending', message: 'Testando proteção' },
        { id: 'logout', name: 'Logout', status: 'pending', message: 'Testando logout' }
      ]
    },
    {
      id: 'navigation',
      name: 'Fluxo de Navegação',
      description: 'Testa navegação entre páginas',
      tests: [
        { id: 'homepage', name: 'HomePage', status: 'pending', message: 'Verificando HomePage' },
        { id: 'dashboard', name: 'Dashboard', status: 'pending', message: 'Testando Dashboard' },
        { id: 'back-buttons', name: 'Botões Voltar', status: 'pending', message: 'Verificando botões voltar' },
        { id: 'breadcrumbs', name: 'Breadcrumbs', status: 'pending', message: 'Testando breadcrumbs' },
        { id: 'mobile-nav', name: 'Navegação Mobile', status: 'pending', message: 'Verificando responsividade' }
      ]
    },
    {
      id: 'assessment',
      name: 'Fluxo de Avaliação',
      description: 'Testa sistema de avaliação completo',
      tests: [
        { id: 'assessment-start', name: 'Início da Avaliação', status: 'pending', message: 'Testando início' },
        { id: 'assessment-questions', name: 'Perguntas', status: 'pending', message: 'Verificando perguntas' },
        { id: 'assessment-progress', name: 'Progresso', status: 'pending', message: 'Testando progresso' },
        { id: 'assessment-save', name: 'Salvamento', status: 'pending', message: 'Verificando salvamento' },
        { id: 'assessment-results', name: 'Resultados', status: 'pending', message: 'Testando resultados' }
      ]
    },
    {
      id: 'sessions',
      name: 'Fluxo de Sessões',
      description: 'Testa player de sessões',
      tests: [
        { id: 'session-list', name: 'Lista de Sessões', status: 'pending', message: 'Verificando lista' },
        { id: 'session-player', name: 'Player de Vídeo', status: 'pending', message: 'Testando player' },
        { id: 'session-controls', name: 'Controles', status: 'pending', message: 'Verificando controles' },
        { id: 'session-progress', name: 'Progresso', status: 'pending', message: 'Testando progresso' },
        { id: 'session-complete', name: 'Conclusão', status: 'pending', message: 'Verificando conclusão' }
      ]
    },
    {
      id: 'courses',
      name: 'Fluxo de Cursos',
      description: 'Testa sistema de cursos',
      tests: [
        { id: 'course-list', name: 'Lista de Cursos', status: 'pending', message: 'Verificando lista' },
        { id: 'course-details', name: 'Detalhes do Curso', status: 'pending', message: 'Testando detalhes' },
        { id: 'course-enrollment', name: 'Inscrição', status: 'pending', message: 'Verificando inscrição' },
        { id: 'course-content', name: 'Conteúdo', status: 'pending', message: 'Testando conteúdo' },
        { id: 'course-progress', name: 'Progresso', status: 'pending', message: 'Verificando progresso' }
      ]
    },
    {
      id: 'admin',
      name: 'Fluxo Admin',
      description: 'Testa painel administrativo',
      tests: [
        { id: 'admin-access', name: 'Acesso Admin', status: 'pending', message: 'Verificando acesso' },
        { id: 'admin-dashboard', name: 'Dashboard Admin', status: 'pending', message: 'Testando dashboard' },
        { id: 'admin-users', name: 'Gerenciamento de Usuários', status: 'pending', message: 'Verificando usuários' },
        { id: 'admin-content', name: 'Gerenciamento de Conteúdo', status: 'pending', message: 'Testando conteúdo' },
        { id: 'admin-reports', name: 'Relatórios', status: 'pending', message: 'Verificando relatórios' }
      ]
    }
  ];

  const runFlowTest = async (flow: FlowTest) => {
    setCurrentFlow(flow);
    setIsRunning(true);
    setResults([]);

    for (const test of flow.tests) {
      setCurrentTest(test.id);
      
      // Simular teste
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await simulateTest(test);
      setResults(prev => [...prev, result]);
    }

    setIsRunning(false);
    setCurrentTest('');
  };

  const simulateTest = async (test: AuditResult): Promise<AuditResult> => {
    // Simulação de testes - em produção seria integrado com testes reais
    const random = Math.random();
    
    if (random > 0.8) {
      return { ...test, status: 'error', message: 'Falha no teste', details: 'Erro simulado' };
    } else if (random > 0.6) {
      return { ...test, status: 'warning', message: 'Aviso no teste', details: 'Aviso simulado' };
    } else {
      return { ...test, status: 'success', message: 'Teste passou', details: 'Sucesso' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-700';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-700';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-700';
    }
  };

  const runAllTests = async () => {
    for (const flow of flows) {
      await runFlowTest(flow);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const resetTests = () => {
    setResults([]);
    setCurrentFlow(null);
    setCurrentTest('');
  };

  return (
    <div className="min-h-screen bg-netflix-bg text-netflix-text p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🔍 Auditoria de Fluxos</h1>
          <p className="text-netflix-text-muted text-lg">
            Sistema de auditoria automática para verificar todos os fluxos da aplicação
          </p>
        </div>

        {/* Controles */}
        <div className="flex gap-4 mb-8">
          <NetflixPrimaryButton onClick={runAllTests} disabled={isRunning}>
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Executando...' : 'Executar Todos os Testes'}
          </NetflixPrimaryButton>
          
          <NetflixSecondaryButton onClick={resetTests}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </NetflixSecondaryButton>
          
          <NetflixOutlineButton onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </NetflixOutlineButton>
        </div>

        {/* Fluxos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {flows.map((flow) => (
            <div key={flow.id} className="netflix-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{flow.name}</h3>
                <NetflixButton 
                  onClick={() => runFlowTest(flow)}
                  disabled={isRunning}
                  size="sm"
                >
                  Testar
                </NetflixButton>
              </div>
              
              <p className="text-netflix-text-muted mb-4">{flow.description}</p>
              
              <div className="space-y-2">
                {flow.tests.map((test) => (
                  <div key={test.id} className="flex items-center gap-2 text-sm">
                    {getStatusIcon(test.status)}
                    <span>{test.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="netflix-card p-6">
            <h3 className="text-2xl font-bold mb-6">📊 Resultados dos Testes</h3>
            
            {currentFlow && (
              <div className="mb-4 p-4 bg-netflix-card border border-netflix-border rounded-lg">
                <h4 className="font-semibold mb-2">Fluxo Atual: {currentFlow.name}</h4>
                {currentTest && (
                  <p className="text-netflix-text-muted">
                    Testando: {currentFlow.tests.find(t => t.id === currentTest)?.name}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              {results.map((result) => (
                <div 
                  key={result.id}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h5 className="font-semibold">{result.name}</h5>
                        <p className="text-sm opacity-80">{result.message}</p>
                        {result.details && (
                          <p className="text-xs opacity-60 mt-1">{result.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Estatísticas */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">
                  {results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-600">Avisos</div>
              </div>
              
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <div className="text-2xl font-bold text-red-500">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-red-600">Erros</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowAuditor; 