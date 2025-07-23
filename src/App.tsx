import React, { useEffect, useState, Suspense, lazy, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ErrorDisplay, useErrorHandler } from '@/hooks/useErrorHandler';
import { initAnalytics, trackPageView } from '@/lib/analytics';
import { MainLayout } from '@/components/layout/MainLayout';
import '@/styles/health-dashboard.css';
import '@/styles/homepage-auth-improvements.css';
import { NetflixThemeTest } from '@/components/NetflixThemeTest';
import EdmundoPage from '@/pages/EdmundoPage';
import ProjetoPrincipal from '@/pages/ProjetoPrincipal';

// Lazy loading das páginas principais
const Index = lazy(() => import('@/pages/Index'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
// EnhancedCourses temporariamente desabilitado
const CoursePage = lazy(() => import('@/pages/CoursePage'));
const LessonPlayerPage = lazy(() => import('@/pages/LessonPlayerPage'));
const LessonEditPage = lazy(() => import('@/pages/LessonEditPage'));
// ModuleEditPage temporariamente desabilitado
const LessonCreatePage = lazy(() => import('@/pages/LessonCreatePage'));
const TestCourses = lazy(() => import('@/pages/TestCourses'));
const FullSession = lazy(() => import('@/pages/FullSession'));
const SampleSession = lazy(() => import('@/pages/SampleSession'));
const PublicRanking = lazy(() => import('@/pages/PublicRanking'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const HealthMetrics = lazy(() => import('@/pages/HealthMetrics'));
const TesteIntegracaoSaude = lazy(() => import('@/pages/TesteIntegracaoSaude').then(module => ({ default: module.TesteIntegracaoSaude })));
const PlataformaSonhos = lazy(() => import('@/pages/PlataformaSonhos'));
const ToolsPage = lazy(() => import('@/pages/ToolsPage').then(module => ({ default: module.ToolsPage })));
<<<<<<< HEAD
// AssessmentPage e AssessmentResultsPage temporariamente desabilitados
=======
>>>>>>> f3f84d6 (Atualização geral do projeto)
const SimpleAssessmentPage = lazy(() => import('@/pages/SimpleAssessmentPage'));
const ResponseAnalysisDemo = lazy(() => import('@/pages/ResponseAnalysisDemo').then(module => ({ default: module.ResponseAnalysisDemo })));
// ToolManagementDemo e UserSessionsDemo temporariamente desabilitados
const SessionResultsDemo = lazy(() => import('@/pages/SessionResultsDemo').then(module => ({ default: module.SessionResultsDemo })));
const FlowAuditor = lazy(() => import('@/components/audit/FlowAuditor').then(module => ({ default: module.default })));
const FlowFixer = lazy(() => import('@/components/audit/FlowFixer').then(module => ({ default: module.default })));
const SabotadoresDemo = lazy(() => import('@/pages/SabotadoresDemo').then(module => ({ default: module.SabotadoresDemo })));

// Lazy loading do painel administrativo
const AdminTestRoute = lazy(() => import('@/components/admin/AdminTestRoute').then(module => ({ default: module.AdminTestRoute })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminUserCreator = lazy(() => import('@/components/admin/AdminUserCreator').then(module => ({ default: module.AdminUserCreator })));

// Configuração otimizada do cliente de query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos (aumentado para melhor performance)
      retry: (failureCount, error) => {
        if (failureCount < 2) return true;
        return false;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Componente de loading otimizado
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-gray-900 to-background">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary/30 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Instituto dos Sonhos
          </h3>
          <p className="text-primary text-sm">Carregando sua experiência...</p>
        </div>
      </div>
    </motion.div>
  </div>
);

//LoadingSpinner.displayName = 'LoadingSpinner';

// Componente de fallback para páginas específicas
const PageFallback = ({ page }: { page: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-gray-900 to-background">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary text-sm">Carregando {page}...</p>
      </div>
    </motion.div>
  </div>
);

//PageFallback.displayName = 'PageFallback';

// Componente de erro boundary
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-gray-900 to-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-destructive mb-4">
                Ops! Algo deu errado
              </h2>
              <p className="text-muted-foreground mb-6">
                Ocorreu um erro inesperado. Por favor, recarregue a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-3 rounded transition-colors"
              >
                Recarregar página
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente principal da aplicação - Otimizado para performance
const AppContent = () => {
  const { errors, clearError, clearErrors } = useErrorHandler();
  const [isInitialized, setIsInitialized] = useState(false);

  const location = useLocation();

  // Inicializar ferramentas de Analytics (executa apenas uma vez)
  useEffect(() => {
    let isMounted = true;
    
    const initAnalyticsAsync = async () => {
      if (isMounted) {
        initAnalytics();
      }
    };
    
    initAnalyticsAsync();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Registrar pageviews a cada mudança de rota
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      trackPageView(location.pathname + location.search);
    }, 100); // Pequeno delay para melhor tracking

    return () => clearTimeout(timeoutId);
  }, [location]);

  useEffect(() => {
    let isMounted = true;
    
    // Inicialização da aplicação com cleanup
    const initApp = async () => {
      try {
        // Preload de recursos críticos com timeout
        const preloadPromises = [
          // Preload de imagens importantes com timeout
          Promise.race([
            new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve;
              img.src = '/src/assets/butterfly-logo.png';
            }),
            new Promise(resolve => setTimeout(resolve, 2000)) // Timeout de 2s
          ]),
          // Simular inicialização de configurações com timeout reduzido
          new Promise((resolve) => setTimeout(resolve, 300))
        ];
        
        await Promise.all(preloadPromises);
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<PageFallback page="Página Inicial" />}>
                <HomePage />
              </Suspense>
            } />
            <Route path="/auth" element={
              <Suspense fallback={<PageFallback page="Autenticação" />}>
                <Auth />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageFallback page="Dashboard" />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="/plataforma" element={
              <Suspense fallback={<PageFallback page="Plataforma dos Sonhos" />}>
                <PlataformaSonhos />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageFallback page="Painel Administrativo" />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="/admin/dashboard" element={
              <Suspense fallback={<PageFallback page="Dashboard Administrativo" />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="/create-admin" element={
              <Suspense fallback={<PageFallback page="Criar Admin" />}>
                <AdminUserCreator />
              </Suspense>
            } />
            <Route path="/session" element={
              <Suspense fallback={<PageFallback page="Sessão" />}>
                <FullSession />
              </Suspense>
            } />
            <Route path="/sample-session" element={
              <Suspense fallback={<PageFallback page="Sessão Demonstrativa" />}>
                <SampleSession />
              </Suspense>
            } />
            <Route path="/ranking" element={
              <Suspense fallback={<PageFallback page="Ranking" />}>
                <PublicRanking />
              </Suspense>
            } />
            <Route path="/health/metrics" element={
              <Suspense fallback={<PageFallback page="Métricas de Saúde" />}>
                <HealthMetrics />
              </Suspense>
            } />
            {/* Rota de cursos removida - agora acessível apenas através do dashboard */}
            <Route path="/courses/:courseId" element={
              <Suspense fallback={<PageFallback page="Curso" />}>
                <CoursePage />
              </Suspense>
            } />
            <Route path="/courses/:courseId/lessons/:lessonId" element={
              <Suspense fallback={<PageFallback page="Aula" />}>
                <LessonPlayerPage />
              </Suspense>
            } />
            <Route path="/admin/courses/:courseId/lessons/:lessonId/edit" element={
              <Suspense fallback={<PageFallback page="Editar Aula" />}>
                <LessonEditPage />
              </Suspense>
            } />
            {/* ModuleEditPage temporariamente desabilitado */}
            <Route path="/admin/courses/:courseId/modules/:moduleId/lessons/new" element={
              <Suspense fallback={<PageFallback page="Nova Aula" />}>
                <LessonCreatePage />
              </Suspense>
            } />
            <Route path="/test-courses" element={
              <Suspense fallback={<PageFallback page="Teste Cursos" />}>
                <TestCourses />
              </Suspense>
            } />
            <Route path="/teste-integracao-saude" element={
              <Suspense fallback={<PageFallback page="Teste Integração Saúde" />}>
                <TesteIntegracaoSaude />
              </Suspense>
            } />
            <Route path="/teste-netflix" element={<NetflixThemeTest />} />
            <Route path="/auditoria-fluxos" element={
              <Suspense fallback={<PageFallback page="Auditoria de Fluxos" />}>
                <FlowAuditor />
              </Suspense>
            } />
                    <Route path="/correcao-fluxos" element={
          <Suspense fallback={<PageFallback page="Correção de Fluxos" />}>
            <FlowFixer />
          </Suspense>
        } />
        <Route path="/sabotadores-demo" element={
          <Suspense fallback={<PageFallback page="Sabotadores do Emagrecimento" />}>
            <SabotadoresDemo />
          </Suspense>
        } />
            <Route path="/tools" element={
              <Suspense fallback={<PageFallback page="Ferramentas" />}>
                <ToolsPage />
              </Suspense>
            } />
<<<<<<< HEAD
            <Route path="/admin/tools" element={
              <Suspense fallback={<PageFallback page="Gerenciar Ferramentas" />}>
                <ToolsPage />
              </Suspense>
            } />
=======
<<<<<<< HEAD
            {/* Assessment routes temporariamente desabilitadas */}
=======
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
            <Route path="/assessment/:toolId" element={
              <Suspense fallback={<PageFallback page="Avaliação" />}>
                <SimpleAssessmentPage />
              </Suspense>
            } />
            <Route path="/assessment/results/:resultId" element={
              <Suspense fallback={<PageFallback page="Resultados da Avaliação" />}>
                <SimpleAssessmentPage />
              </Suspense>
            } />
>>>>>>> f3f84d6 (Atualização geral do projeto)
            <Route path="/assessment/simple/:toolId" element={
              <Suspense fallback={<PageFallback page="Avaliação Simples" />}>
                <SimpleAssessmentPage />
              </Suspense>
            } />
            <Route path="/response-analysis" element={
              <Suspense fallback={<PageFallback page="Análise de Respostas" />}>
                <ResponseAnalysisDemo />
              </Suspense>
            } />
            {/* Tool management e user sessions temporariamente desabilitados */}
            <Route path="/session-results" element={
              <Suspense fallback={<PageFallback page="Resultados da Sessão" />}>
                <SessionResultsDemo />
              </Suspense>
            } />
            {/* Rota removida - página não existe mais */}
            <Route path="*" element={
              <Suspense fallback={<PageFallback page="Página" />}>
                <NotFound />
              </Suspense>
            } />
            {/* Rota direta para Edmundo Roveri sem autenticação */}
            <Route path="/edmundo" element={<EdmundoPage />} />
            <Route path="/projeto" element={<ProjetoPrincipal />} />
          </Routes>
        </AnimatePresence>
        
        <Toaster />
        <ErrorDisplay 
          errors={errors} 
          onClearError={clearError} 
          onClearAll={clearErrors} 
        />
      </MainLayout>
    </ErrorBoundary>
  );
};

//AppContent.displayName = 'AppContent';

// Componente raiz da aplicação
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

//App.displayName = 'App';

export default App;
