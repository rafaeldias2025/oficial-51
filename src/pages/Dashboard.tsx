
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ModernDashboard } from "@/components/dashboard/ModernDashboard";
import { ModernLayout } from "@/components/layout/ModernLayout";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { ArrowLeft, Menu, X, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { DadosFisicosForm } from "@/components/DadosFisicosForm";
import AvaliacaoSemanal from "@/components/AvaliacaoSemanal";
import { RealUserRanking } from "@/components/RealUserRanking";
import MinhasMetas from "@/components/MinhasMetas";
import Desafios from "@/components/Desafios";
import DiarioSaude from "@/components/DiarioSaude";
import MissaoDia from "@/components/MissaoDia";
import { BeneficiosVisuais } from "@/components/BeneficiosVisuais";
import { ProgressCharts } from "@/components/ProgressCharts";
import { TesteSabotadores } from "@/components/TesteSabotadores";
import { useGoals } from "@/hooks/useGoals";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { ClientSessions } from "@/components/sessions/ClientSessions";
import { RequiredDataModal } from "@/components/RequiredDataModal";
<<<<<<< HEAD

=======
<<<<<<< HEAD
// PaidCourses e UserAssessments temporariamente desabilitados
=======
>>>>>>> f3f84d6 (Atualização geral do projeto)
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
import { AdvancedHealthDashboard } from "@/components/dashboard/AdvancedHealthDashboard";
import { HealthLayout } from "@/components/layout/HealthLayout";

import { GoogleFitIntegration } from "@/components/GoogleFitIntegration";
import { PlataformaSonhos } from "@/components/plataforma/PlataformaSonhos";
import { BluetoothScaleTest } from "@/components/BluetoothScaleTest";

import { useAuth } from "@/hooks/useAuth";
import { 
  NetflixButton,
  NetflixPrimaryButton,
  NetflixSecondaryButton,
  NetflixOutlineButton,
  NetflixGhostButton
} from "@/components/ui/netflix-buttons";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home,
  Trophy,
  Calendar,
  Target,
  Award,
  FileText,
  Settings,
  BarChart3,
  Scale,
  GraduationCap,
  User,
  Activity,
  CreditCard,
  Grid,
  HelpCircle,
  ClipboardList
} from "lucide-react";

import { TestProgress } from '@/components/TestProgress';
import { MeuProgresso } from '@/components/MeuProgresso';

// Dados mock para ranking
const topRankingUsers = [
  {id: 1, name: "Ana Silva", points: 3200, position: 1, lastPosition: 2, streak: 25, completedChallenges: 28, cidade: "São Paulo", trend: 'up' as const, positionChange: 1},
  {id: 2, name: "Carlos Santos", points: 2800, position: 2, lastPosition: 1, streak: 20, completedChallenges: 22, cidade: "Rio de Janeiro", trend: 'down' as const, positionChange: 1},
  {id: 3, name: "Maria Costa", points: 2400, position: 3, lastPosition: 3, streak: 15, completedChallenges: 18, cidade: "Belo Horizonte", trend: 'stable' as const, positionChange: 0},
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rankingTimeFilter, setRankingTimeFilter] = useState<'week' | 'month' | 'all'>('week');

  // Debug logs
  console.log('🔍 Dashboard Debug:', {
    user: !!user,
    userId: user?.id,
    userEmail: user?.email,
    activeSection
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inicio', label: 'Missão do Dia', icon: Activity },
    { id: 'plataforma-sonhos', label: 'Plataforma dos Sonhos', icon: GraduationCap },
    { id: 'sessoes', label: 'Sessões', icon: FileText },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardList },
    { id: 'semanal', label: '📊 Semanal', icon: Calendar, highlight: true },
    { id: 'avaliacao-semanal', label: 'Avaliação Semanal', icon: Calendar },
    { id: 'metas', label: 'Minhas Metas', icon: Target },
    { id: 'desafios', label: 'Desafios', icon: Award },
    { id: 'diario', label: 'Diário de Saúde', icon: FileText },
    { id: 'teste-sabotadores', label: 'Teste de Sabotadores', icon: Settings },
    { id: 'meu-progresso', label: 'Meu Progresso', icon: BarChart3 },
    { id: 'analise-avancada', label: 'Análise Avançada', icon: BarChart3 },
    { id: 'google-fit', label: 'Google Fit', icon: Activity },
    { id: 'openScale-test', label: 'Teste Xiaomi Mi Body Scale 2', icon: Scale },
    { id: 'assinaturas', label: 'Assinaturas', icon: CreditCard },
    { id: 'apps', label: 'Apps', icon: Grid },
    { id: 'ajuda', label: 'Ajuda', icon: HelpCircle },
    
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ModernDashboard user={{name: user?.email?.split('@')[0] || 'Usuário'}} />;
      case 'inicio':
        return <MissaoDia isVisitor={false} />;
<<<<<<< HEAD
=======
      case 'cursos-pagos':
<<<<<<< HEAD
        return <div className="p-8"><h2 className="text-2xl font-bold mb-4">Cursos Premium</h2><p>Funcionalidade temporariamente desabilitada</p></div>;
=======
        return <div className="p-4">Cursos pagos em desenvolvimento</div>;
>>>>>>> f3f84d6 (Atualização geral do projeto)
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
      case 'sessoes':
        return <ClientSessions />;
      case 'ranking':
        return (
          <RealUserRanking 
            timeFilter={rankingTimeFilter}
            onTimeFilterChange={setRankingTimeFilter}
          />
        );
      case 'avaliacoes':
<<<<<<< HEAD
        return <UserAssessments />;
      case 'semanal':
        return <AvaliacaoSemanal />;
=======
        return <div className="p-8"><h2 className="text-2xl font-bold mb-4">Avaliações</h2><p>Funcionalidade temporariamente desabilitada</p></div>;
>>>>>>> 4846d544f11e74d16f8f110ad6be41e8bc96feb6
      case 'avaliacao-semanal':
        return <AvaliacaoSemanal />;
      case 'metas':
        return <MinhasMetas userType="cliente" />;
      case 'desafios':
        return <Desafios />;
      case 'diario':
        return <DiarioSaude />;
      case 'teste-sabotadores':
        return <TesteSabotadores />;
      case 'meu-progresso':
        return <MeuProgresso />;
      case 'analise-avancada':
        return <AdvancedHealthDashboard />;
      case 'google-fit':
        return <GoogleFitIntegration />;
      case 'openScale-test':
        return <BluetoothScaleTest />;
      case 'plataforma-sonhos':
        return <PlataformaSonhos isEmbedded={true} onBack={() => setActiveSection('dashboard')} />;
      case 'assinaturas':
        return <div className="p-8"><h2 className="text-2xl font-bold mb-4">Assinaturas</h2><p>Gerenciamento de assinaturas em desenvolvimento...</p></div>;
      case 'apps':
        return <div className="p-8"><h2 className="text-2xl font-bold mb-4">Apps</h2><p>Integrações de apps em desenvolvimento...</p></div>;
      case 'ajuda':
        return <div className="p-8"><h2 className="text-2xl font-bold mb-4">Ajuda</h2><p>Central de ajuda em desenvolvimento...</p></div>;

      default:
        return <ModernDashboard user={{name: user?.email?.split('@')[0] || 'Usuário'}} />;
    }
  };

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gradient hover:opacity-80 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </Link>
          ) : (
            <Link 
              to="/" 
              className="flex items-center justify-center text-primary hover:text-primary/80 transition-all duration-300 hover:scale-110"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          
          {/* Botões do lado direito */}
          <div className="flex items-center gap-2">
            {/* Botão de colapsar - só no desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <NetflixGhostButton
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </NetflixGhostButton>
            </div>
            
            {/* Botão de fechar mobile */}
            <NetflixGhostButton
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-destructive/10 border border-border/50 hover:border-destructive/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </NetflixGhostButton>
          </div>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <UserProfileMenu />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 scrollbar-modern">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ModernButton
                variant={activeSection === item.id ? "gradient" : item.highlight ? "destructive" : "ghost"}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'glow-primary shadow-lg scale-105 border border-primary/30' 
                    : item.highlight
                    ? 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50'
                    : 'hover:bg-muted/50 hover:scale-105 hover:border-border/50 border border-transparent'
                } ${isCollapsed ? 'px-2' : 'px-4'} rounded-lg`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </ModernButton>
              
              {/* Tooltip para modo colapsado */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-card border border-border text-card-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-border rotate-45"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-gradient-to-r from-muted/20 to-background">
        <ModernButton
          onClick={signOut}
          variant="ghost"
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300`}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </ModernButton>
      </div>
    </div>
  );

  return (
    <ModernLayout variant="default">
      <div className="min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden glass-card border-b border-border p-4 bg-gradient-to-r from-background to-muted/10">
          <div className="flex items-center justify-between">
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </ModernButton>
            <h1 className="text-xl font-semibold text-gradient bg-clip-text">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <motion.div 
            animate={{ 
              width: sidebarCollapsed ? '80px' : '280px' 
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:flex lg:flex-col glass-card border-r border-border shadow-xl"
          >
            <SidebarContent isCollapsed={sidebarCollapsed} />
          </motion.div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-background/90 backdrop-blur-md z-40"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 30, stiffness: 150 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 w-80 glass-card border-r border-border z-50 shadow-2xl"
                >
                  <SidebarContent isCollapsed={false} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>

        {/* Required Data Modal */}
        <RequiredDataModal />
      </div>
    </ModernLayout>
  );
};

export default Dashboard;