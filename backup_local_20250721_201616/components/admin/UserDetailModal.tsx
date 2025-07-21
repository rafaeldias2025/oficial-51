import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  TrendingUp,
  Activity,
  Target,
  Heart,
  Scale
} from 'lucide-react';
import { AdminUser } from '@/hooks/useAdminActions';
import { supabase } from '@/integrations/supabase/client';

interface UserDetailModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalPoints: number;
  weeklyEvaluations: number;
  lastActivity: string;
  healthData?: {
    weight: number;
    height: number;
    bmi: number;
    waist: number;
  };
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserStats();
    }
  }, [user, isOpen]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto, vamos usar dados básicos
      const stats: UserStats = {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalPoints: user.total_points || 0,
        weeklyEvaluations: 0,
        lastActivity: user.updated_at || user.created_at || 'Nunca',
        healthData: undefined // Por enquanto, sem dados de saúde
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'client': return 'bg-green-500 text-white';
      case 'visitor': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Abaixo do peso', color: 'text-blue-500' };
    if (bmi < 25) return { status: 'Peso normal', color: 'text-green-500' };
    if (bmi < 30) return { status: 'Sobrepeso', color: 'text-yellow-500' };
    return { status: 'Obesidade', color: 'text-red-500' };
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.full_name || 'Usuário sem nome'}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge className={getRoleColor(user.role || 'visitor')}>
              {user.role || 'visitor'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="health">Saúde</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pontos Totais</p>
                      <p className="text-2xl font-bold">{userStats?.totalPoints || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cursos</p>
                      <p className="text-2xl font-bold">{userStats?.coursesEnrolled || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avaliações</p>
                      <p className="text-2xl font-bold">{userStats?.weeklyEvaluations || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Última Atividade</p>
                      <p className="text-sm font-medium">
                        {userStats?.lastActivity ? 
                          new Date(userStats.lastActivity).toLocaleDateString('pt-BR') : 
                          'Nunca'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Cadastrado em {new Date(user.created_at || '').toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {user.updated_at && user.updated_at !== user.created_at && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Última atualização em {new Date(user.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            {userStats?.healthData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Dados Físicos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="text-2xl font-bold">{userStats.healthData.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Altura</p>
                      <p className="text-2xl font-bold">{userStats.healthData.height}cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Circunferência Abdominal</p>
                      <p className="text-2xl font-bold">{userStats.healthData.waist}cm</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      IMC
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-4xl font-bold">{userStats.healthData.bmi}</p>
                      <p className={`text-sm font-medium ${getBMIStatus(userStats.healthData.bmi).color}`}>
                        {getBMIStatus(userStats.healthData.bmi).status}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Abaixo</span>
                        <span>Normal</span>
                        <span>Sobrepeso</span>
                        <span>Obesidade</span>
                      </div>
                      <Progress 
                        value={Math.min((userStats.healthData.bmi / 35) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum dado de saúde registrado ainda
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Sistema de cursos será implementado em breve
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Histórico de atividades será implementado em breve
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};