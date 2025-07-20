import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Settings, 
  BarChart3, 
  MessageCircle, 
  Trophy,
  Monitor,
  Grid,
  AlertCircle
} from 'lucide-react';
import { DynamicHero } from './DynamicHero';
import { ScalableModuleSystem } from './ScalableModuleSystem';
import { SocialInteraction } from './SocialInteraction';
import { AdditionalFeatures } from './AdditionalFeatures';
import { AdminAnalytics } from './AdminAnalytics';
import { useAuth } from '@/hooks/useAuth';

interface PremiumCourseSystemProps {
  courseId: string;
}

export const PremiumCourseSystem: React.FC<PremiumCourseSystemProps> = ({ courseId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('hero');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário é admin (simplificado)
    setIsAdmin(user?.email === 'admin@example.com' || user?.email === 'claude@example.com');
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="h-64 bg-muted" />
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32 bg-muted" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Erro no Sistema Premium</h3>
          </div>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => setError(null)}>
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Curso Premium */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Sistema Premium de Cursos</CardTitle>
                <p className="text-muted-foreground">
                  Experiência completa com funcionalidades avançadas
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-primary">
              Premium
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Navegação por Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="hero" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center space-x-2">
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">Módulos</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Recursos</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Conteúdo das Abas */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Hero Dinâmico</span>
                {isAdmin && (
                  <Badge variant="outline" className="ml-auto">
                    <Settings className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicHero courseId={courseId} isAdmin={isAdmin} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grid className="h-5 w-5" />
                <span>Sistema de Módulos Escalável</span>
                {isAdmin && (
                  <Badge variant="outline" className="ml-auto">
                    <Settings className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScalableModuleSystem courseId={courseId} isAdmin={isAdmin} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Interação Social</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SocialInteraction courseId={courseId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Recursos Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdditionalFeatures courseId={courseId} isAdmin={isAdmin} />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics Administrativo</span>
                  <Badge variant="destructive" className="ml-auto">
                    Acesso Restrito
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminAnalytics courseId={courseId} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Resumo de Funcionalidades */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Funcionalidades Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Hero Dinâmico (Imagem/Vídeo)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Módulos Escaláveis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Sistema de Comentários</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Favoritos e Avaliações</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Badges e Conquistas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Certificados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Playlists Personalizadas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Modo Noturno</span>
            </div>
            {isAdmin && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Analytics Avançado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Controles Admin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Estatísticas Detalhadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Configurações Avançadas</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 