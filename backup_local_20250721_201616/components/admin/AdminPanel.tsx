import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  Video, 
  TrendingUp, 
  Users, 
  Settings, 
  BookOpen, 
  Plus, 
  Award,
  Upload,
  Target,
  CheckCircle,
  ClipboardList,
  Calendar
} from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { LessonManager } from './LessonManager';
import { ModuleManager } from './ModuleManager';
import { CourseManager } from './CourseManager';
import { JourneyManager } from './JourneyManager';
import { QuizManager } from './QuizManager';
import { AnamneseManager } from './AnamneseManager';
// SessionManager temporariamente desabilitado

type AdminTab = 'dashboard' | 'courses' | 'modules' | 'lessons' | 'journeys' | 'quizzes' | 'anamnese' | 'sessions' | 'analytics' | 'users' | 'settings';

interface AdminStats {
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  totalUsers: number;
  totalViews: number;
  totalRevenue: number;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStats>({
    totalCourses: 12,
    totalModules: 45,
    totalLessons: 180,
    totalUsers: 15420,
    totalViews: 45600,
    totalRevenue: 45600
  });

  const tabs = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Visão geral do sistema'
    },
    {
      id: 'courses' as AdminTab,
      label: 'Cursos',
      icon: BookOpen,
      description: 'Gerenciar cursos'
    },
    {
      id: 'modules' as AdminTab,
      label: 'Módulos',
      icon: FileText,
      description: 'Gerenciar módulos'
    },
    {
      id: 'lessons' as AdminTab,
      label: 'Aulas',
      icon: Video,
      description: 'Gerenciar aulas'
    },
    {
      id: 'journeys' as AdminTab,
      label: 'Jornadas',
      icon: Target,
      description: 'Gerenciar jornadas'
    },
    {
      id: 'quizzes' as AdminTab,
      label: 'Quizzes',
      icon: CheckCircle,
      description: 'Gerenciar quizzes'
    },
    {
      id: 'anamnese' as AdminTab,
      label: 'Anamnese',
      icon: ClipboardList,
      description: 'Questionários de avaliação'
    },
    {
      id: 'sessions' as AdminTab,
      label: 'Sessões',
      icon: Calendar,
      description: 'Gerenciar sessões de coaching'
    },
    {
      id: 'analytics' as AdminTab,
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Métricas e relatórios'
    },
    {
      id: 'users' as AdminTab,
      label: 'Usuários',
      icon: Users,
      description: 'Gerenciar usuários'
    },
    {
      id: 'settings' as AdminTab,
      label: 'Configurações',
      icon: Settings,
      description: 'Configurações do sistema'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'courses':
        return <CourseManager />;
      case 'modules':
        return <ModuleManager />;
      case 'lessons':
        return <LessonManager />;
      case 'journeys':
        return <JourneyManager />;
      case 'quizzes':
        return <QuizManager />;
      case 'anamnese':
        return <AnamneseManager />;
      case 'sessions':
        return <div className="p-6 text-center text-netflix-lightGray">SessionManager temporariamente desabilitado</div>;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UsersManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-darkGray border-b border-netflix-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-netflix-red" />
                <h1 className="text-xl font-bold text-netflix-white">Admin Panel</h1>
              </div>
              <Badge variant="outline" className="bg-netflix-success/10 text-netflix-success border-netflix-success/20">
                Sistema Ativo
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="netflix-outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Backup
              </Button>
              <Button variant="netflix-outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-netflix-darkGray p-1 rounded-lg border border-netflix-border overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "netflix" : "netflix-outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 whitespace-nowrap ${activeTab === tab.id ? "" : "opacity-75 hover:opacity-100"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-netflix-darkGray rounded-lg border border-netflix-border">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const DashboardOverview: React.FC<{ stats: AdminStats }> = ({ stats }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-netflix-white">Dashboard</h2>
        <p className="text-netflix-lightGray">Visão geral da plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-netflix-white">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-netflix-lightGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-netflix-white">{stats.totalCourses}</div>
            <p className="text-xs text-netflix-lightGray">Cursos ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-netflix-white">Total de Módulos</CardTitle>
            <FileText className="h-4 w-4 text-netflix-lightGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-netflix-white">{stats.totalModules}</div>
            <p className="text-xs text-netflix-lightGray">Módulos criados</p>
          </CardContent>
        </Card>

        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-netflix-white">Total de Aulas</CardTitle>
            <Video className="h-4 w-4 text-netflix-lightGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-netflix-white">{stats.totalLessons}</div>
            <p className="text-xs text-netflix-lightGray">Aulas publicadas</p>
          </CardContent>
        </Card>

        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-netflix-white">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-netflix-lightGray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-netflix-white">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-netflix-lightGray">Usuários registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-netflix-white">
              <Plus className="h-5 w-5 text-netflix-red" />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="netflix-outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Adicionar Curso
            </Button>
            <Button className="w-full justify-start" variant="netflix-outline">
              <FileText className="w-4 h-4 mr-2" />
              Adicionar Módulo
            </Button>
            <Button className="w-full justify-start" variant="netflix-outline">
              <Video className="w-4 h-4 mr-2" />
              Adicionar Aula
            </Button>
            <Button className="w-full justify-start" variant="netflix-outline">
              <Target className="w-4 h-4 mr-2" />
              Adicionar Jornada
            </Button>
            <Button className="w-full justify-start" variant="netflix-outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Adicionar Quiz
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-netflix-white">
              <TrendingUp className="h-5 w-5 text-netflix-info" />
              <span>Métricas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-netflix-lightGray">Visualizações:</span>
              <span className="text-sm font-medium text-netflix-white">{stats.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-netflix-lightGray">Receita:</span>
              <span className="text-sm font-medium text-netflix-white">R$ {stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-netflix-lightGray">Taxa de Conclusão:</span>
              <span className="text-sm font-medium text-netflix-white">67%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-netflix-white">
              <Award className="h-5 w-5 text-netflix-warning" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-netflix-white">7 CHAVES</span>
              <Badge variant="outline" className="border-netflix-red text-netflix-white">1º</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-netflix-white">12 CHÁS</span>
              <Badge variant="outline" className="border-netflix-red text-netflix-white">2º</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-netflix-white">PÍLULAS DO BEM</span>
              <Badge variant="outline" className="border-netflix-red text-netflix-white">3º</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UsersManager: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-netflix-white mb-4">Gerenciar Usuários</h2>
      <p className="text-netflix-lightGray mb-6">Sistema de usuários em desenvolvimento...</p>
      <div className="h-64 flex items-center justify-center bg-netflix-black/30 rounded">
        <p className="text-netflix-lightGray">User Manager - Em desenvolvimento</p>
      </div>
    </div>
  );
};

const SettingsManager: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-netflix-white mb-4">Configurações</h2>
      <p className="text-netflix-lightGray mb-6">Configurações do sistema em desenvolvimento...</p>
      <div className="h-64 flex items-center justify-center bg-netflix-black/30 rounded">
        <p className="text-netflix-lightGray">Settings Manager - Em desenvolvimento</p>
      </div>
    </div>
  );
}; 