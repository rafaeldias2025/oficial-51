import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Heart,
  Users,
  Target,
  Zap,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { CoachingSession } from '@/types/session-system';

interface UserSessionsProps {
  onStartSession: (sessionId: string) => void;
}

export const UserSessions: React.FC<UserSessionsProps> = ({ onStartSession }) => {
  const { sessions, loading, error } = useSessionManagement();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mental':
        return <Brain className="w-4 h-4" />;
      case 'emocional':
        return <Heart className="w-4 h-4" />;
      case 'relacionamentos':
        return <Users className="w-4 h-4" />;
      case 'objetivos':
        return <Target className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mental':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'emocional':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'relacionamentos':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'objetivos':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredSessions = selectedCategory === 'all' 
    ? sessions 
    : sessions.filter(session => session.coaching_tools?.category?.toLowerCase() === selectedCategory);

  const categories = [
    { id: 'all', name: 'Todas', icon: <Zap className="w-4 h-4" /> },
    { id: 'mental', name: 'Mental', icon: <Brain className="w-4 h-4" /> },
    { id: 'emocional', name: 'Emocional', icon: <Heart className="w-4 h-4" /> },
    { id: 'relacionamentos', name: 'Relacionamentos', icon: <Users className="w-4 h-4" /> },
    { id: 'objetivos', name: 'Objetivos', icon: <Target className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas sessões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📋 Minhas Sessões</h2>
          <p className="text-gray-600">Gerencie suas sessões de coaching</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {sessions.length} sessão{sessions.length !== 1 ? 'ões' : ''}
          </span>
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Sessões */}
      {filteredSessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma sessão encontrada
                </h3>
                <p className="text-gray-600">
                  {selectedCategory === 'all' 
                    ? 'Você ainda não tem sessões agendadas.'
                    : `Nenhuma sessão na categoria "${categories.find(c => c.id === selectedCategory)?.name}".`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(session.coaching_tools?.category)}
                    <CardTitle className="text-lg line-clamp-2">
                      {session.coaching_tools?.name || 'Sessão'}
                    </CardTitle>
                  </div>
                  {getStatusIcon(session.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {session.coaching_tools?.estimated_time || 30} min
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {session.coaching_tools?.description || 'Descrição não disponível'}
                </p>
                
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusText(session.status)}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(session.coaching_tools?.category)}>
                      {session.coaching_tools?.category || 'Geral'}
                    </Badge>
                  </div>

                  {/* Progresso */}
                  {session.status === 'in_progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progresso</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  )}

                  {/* Data */}
                  {session.scheduledDate && (
                    <div className="text-xs text-gray-500">
                      Agendada para: {new Date(session.scheduledDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2">
                    {session.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onStartSession(session.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                    
                    {session.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => onStartSession(session.id)}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Continuar
                      </Button>
                    )}
                    
                    {session.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => onStartSession(session.id)}
                      >
                        Ver Resultados
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}; 