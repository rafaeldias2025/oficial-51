// ====================================================================
// LAYOUT UNIFICADO E OTIMIZADO
// Substitui: MainLayout, ModernLayout, HealthLayout, MobileHeader
// ====================================================================

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Target, 
  Zap,
  Menu,
  Search,
  Bell,
  User,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useHealthData } from '@/hooks/useHealthData';
import { useIsMobile } from '@/hooks/use-mobile';

// === TIPOS ===
interface UnifiedLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'health';
  showHealthPanel?: boolean;
  showMobileHeader?: boolean;
  enableQuickAccess?: boolean;
  title?: string;
}

interface HealthStats {
  metabolicAge: number;
  realAge: number;
  vitalityScore: number;
  dailyGoals: number;
  completedGoals: number;
  weeklyProgress: number;
}

// === COMPONENTES INTERNOS ===
const MobileHeader: React.FC<{ 
  title: string; 
  onMenuClick: () => void; 
  isMenuOpen: boolean;
}> = ({ title, onMenuClick, isMenuOpen }) => (
  <header className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-white/20 px-4 py-3 sticky top-0 z-50">
    <div className="flex items-center justify-between">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="p-2">
          <Search size={20} />
        </Button>
        <Button variant="ghost" size="sm" className="p-2 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <User size={20} />
        </Button>
      </div>
    </div>
  </header>
);

const HealthPanel: React.FC<{ 
  isCollapsed: boolean; 
  onToggle: () => void; 
  stats: HealthStats;
  onOpenDashboard: () => void;
}> = ({ isCollapsed, onToggle, stats, onOpenDashboard }) => {
  const quickStats = [
    {
      icon: Heart,
      label: 'Idade Metabólica',
      value: `${stats.metabolicAge} anos`,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      trend: stats.metabolicAge < stats.realAge ? 'up' : 'down'
    },
    {
      icon: Zap,
      label: 'Vitalidade',
      value: `${stats.vitalityScore}%`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      trend: stats.vitalityScore > 80 ? 'up' : 'down'
    },
    {
      icon: Target,
      label: 'Metas Diárias',
      value: `${stats.completedGoals}/${stats.dailyGoals}`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: stats.completedGoals >= stats.dailyGoals ? 'up' : 'down'
    }
  ];

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: isCollapsed ? 240 : 0 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="health-card bg-white/95 backdrop-blur-lg rounded-l-2xl shadow-2xl border border-white/20">
        {/* Collapse Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle}
          className={cn(
            "absolute -left-10 top-1/2 -translate-y-1/2",
            "w-10 h-16 rounded-l-xl bg-white/95 border border-r-0 border-white/20",
            "hover:bg-orange-50 transition-colors"
          )}
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>

        <div className={cn("p-4 w-72 transition-all duration-300", isCollapsed && "opacity-0 pointer-events-none")}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Health Center</h3>
            </div>
            <Badge className="metabolic-age-badge">
              {stats.metabolicAge} anos
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3 mb-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  stat.trend === 'up' ? 'bg-green-400' : 'bg-yellow-400'
                )} />
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso Semanal</span>
              <span>{stats.weeklyProgress}%</span>
            </div>
            <div className="health-progress h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.weeklyProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onOpenDashboard}
            className="w-full health-glow bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
          >
            <Activity className="w-4 h-4 mr-2" />
            Abrir Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const HealthStatsBar: React.FC<{ stats: HealthStats; onOpenDashboard: () => void }> = ({ 
  stats, 
  onOpenDashboard 
}) => (
  <motion.div
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-3"
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-gray-700">
            Idade Metabólica: <strong className="text-red-600">{stats.metabolicAge} anos</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">
            Vitalidade: <strong className="text-orange-600">{stats.vitalityScore}%</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            Metas: <strong className="text-blue-600">{stats.completedGoals}/{stats.dailyGoals}</strong>
          </span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onOpenDashboard}
        className="nav-btn-top"
      >
        <Activity className="w-4 h-4 mr-2" />
        Health Dashboard
      </Button>
    </div>
  </motion.div>
);

// === COMPONENTE PRINCIPAL ===
export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  className,
  variant = 'default',
  showHealthPanel = true,
  showMobileHeader = true,
  enableQuickAccess = true,
  title = 'Jornada dos Sonhos'
}) => {
  // Hooks
  const isMobile = useIsMobile();
  const { physicalData, bmi, isDataComplete } = useHealthData();

  // Estados
  const [showHealthDashboard, setShowHealthDashboard] = useState(false);
  const [isHealthPanelCollapsed, setIsHealthPanelCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Health stats computados
  const healthStats: HealthStats = {
    metabolicAge: 28, // Pode ser calculado baseado em outros dados de saúde
    realAge: physicalData?.data_nascimento ? 
      new Date().getFullYear() - new Date(physicalData.data_nascimento).getFullYear() : 32,
    vitalityScore: 85,
    dailyGoals: 3,
    completedGoals: 2,
    weeklyProgress: 72
  };

  // Handlers
  const handleToggleHealthPanel = useCallback(() => {
    setIsHealthPanelCollapsed(prev => !prev);
  }, []);

  const handleOpenDashboard = useCallback(() => {
    setShowHealthDashboard(true);
  }, []);

  const handleCloseDashboard = useCallback(() => {
    setShowHealthDashboard(false);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Estilos por variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card backdrop-blur-lg';
      case 'gradient':
        return 'bg-gradient-to-br from-slate-50 to-slate-100';
      case 'health':
        return 'bg-gradient-to-br from-orange-50 to-rose-50';
      default:
        return 'bg-background';
    }
  };

  // Fechar menu mobile quando sair do mobile
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <div className={cn(
      "min-h-screen transition-all duration-300",
      getVariantClasses(),
      className
    )}>
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--accent)_0%,_transparent_50%)] opacity-5" />
      </div>

      {/* Mobile Header */}
      {showMobileHeader && isMobile && (
        <MobileHeader 
          title={title}
          onMenuClick={handleToggleMobileMenu}
          isMenuOpen={isMobileMenuOpen}
        />
      )}

      {/* Health Stats Bar - Desktop */}
      {showHealthPanel && !isMobile && isDataComplete && (
        <HealthStatsBar 
          stats={healthStats}
          onOpenDashboard={handleOpenDashboard}
        />
      )}

      {/* Floating Health Panel - Desktop */}
      {enableQuickAccess && showHealthPanel && !isMobile && isDataComplete && (
        <HealthPanel
          isCollapsed={isHealthPanelCollapsed}
          onToggle={handleToggleHealthPanel}
          stats={healthStats}
          onOpenDashboard={handleOpenDashboard}
        />
      )}

      {/* Health Dashboard Modal */}
      <AnimatePresence>
        {showHealthDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseDashboard}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-7xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Health Dashboard</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseDashboard}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Dashboard content placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                    <Heart className="w-8 h-8 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Idade Metabólica</h3>
                    <p className="text-3xl font-bold text-red-600">{healthStats.metabolicAge} anos</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <Zap className="w-8 h-8 text-orange-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Vitalidade</h3>
                    <p className="text-3xl font-bold text-orange-600">{healthStats.vitalityScore}%</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <Target className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Progresso Semanal</h3>
                    <p className="text-3xl font-bold text-blue-600">{healthStats.weeklyProgress}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={handleToggleMobileMenu}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 h-full bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <Button variant="ghost" size="sm" onClick={handleToggleMobileMenu}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Menu content placeholder */}
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="w-5 h-5 mr-3" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Target className="w-5 h-5 mr-3" />
                  Metas
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Activity className="w-5 h-5 mr-3" />
                  Atividades
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}; 