import React, { useState } from 'react';
import { UserSessions } from '@/components/sessions/UserSessions';
import { SessionPlayer } from '@/components/sessions/SessionPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Play, 
  BarChart3, 
  Target,
  Brain,
  Heart,
  Users,
  Zap
} from 'lucide-react';

export const UserSessionsDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'sessions' | 'player'>('sessions');
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessionResults, setSessionResults] = useState<any>(null);

  const handleStartSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setCurrentView('player');
  };

  const handleBackToSessions = () => {
    setCurrentView('sessions');
    setCurrentSessionId('');
    setSessionResults(null);
  };

  const handleSessionComplete = (results: any) => {
    setSessionResults(results);
    // Aqui você pode adicionar navegação para resultados
    console.log('Sessão completa:', results);
  };

  if (currentView === 'player') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Play className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Sessão Ativa</h1>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">Em Progresso</Badge>
                <span className="text-sm text-gray-600">Usuário Demo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Player */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SessionPlayer
            sessionId={currentSessionId}
            onComplete={handleSessionComplete}
            onBack={handleBackToSessions}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Minhas Sessões</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Usuário</Badge>
              <span className="text-sm text-gray-600">João Silva</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Disponíveis</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Sabotadores do Emagrecimento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+2 este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Sessão</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/01</div>
              <p className="text-xs text-muted-foreground">Roda da Vida</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-sm">Mental</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-blue-600">Sessões</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                <CardTitle className="text-sm">Emocional</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">1</div>
              <p className="text-xs text-green-600">Sessão</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-sm">Relacionamentos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">0</div>
              <p className="text-xs text-purple-600">Sessões</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-sm">Objetivos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-xs text-orange-600">Sessão</p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <UserSessions onStartSession={handleStartSession} />
      </div>
    </div>
  );
}; 