import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Grid, Sparkles } from 'lucide-react';
import { EnhancedCourseGrid } from './EnhancedCourseGrid';
import { PremiumCourseSystem } from './PremiumCourseSystem';

export const PaidCourses = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'grid' | 'premium'>('grid');

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveView('premium');
  };

  const handleBackToGrid = () => {
    setSelectedCourseId(null);
    setActiveView('grid');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl text-foreground">Cursos Premium</CardTitle>
                <p className="text-muted-foreground">
                  Experiência completa com recursos avançados e funcionalidades exclusivas
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-4 w-4 mr-1" />
              Premium
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Navegação de Visualização */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'grid' | 'premium')}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center space-x-2">
              <Grid className="h-4 w-4" />
              <span>Grade de Cursos</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Sistema Premium</span>
            </TabsTrigger>
          </TabsList>

          {selectedCourseId && activeView === 'premium' && (
            <Button
              variant="outline"
              onClick={handleBackToGrid}
              className="flex items-center space-x-2"
            >
              <Grid className="h-4 w-4" />
              <span>Voltar à Grade</span>
            </Button>
          )}
      </div>

        {/* Grade de Cursos */}
        <TabsContent value="grid" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grid className="h-5 w-5" />
                <span>Todos os Cursos Premium</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedCourseGrid
                onCourseSelect={handleCourseSelect}
                selectedCourseId={selectedCourseId}
              />
              </CardContent>
            </Card>

          {/* Informações sobre o Sistema Premium */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Crown className="h-5 w-5" />
                <span>Por que escolher Premium?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">Hero Dinâmico</h3>
                  <p className="text-sm text-muted-foreground">
                    Heroes personalizáveis com imagens ou vídeos de apresentação
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Grid className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-medium text-foreground">Módulos Escaláveis</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema flexível de organização de conteúdo por módulos
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="font-medium text-foreground">Gamificação</h3>
                  <p className="text-sm text-muted-foreground">
                    Badges, certificados e sistema de conquistas
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-warning" />
          </div>
                  <h3 className="font-medium text-foreground">Interação Social</h3>
                  <p className="text-sm text-muted-foreground">
                    Comentários, favoritos, avaliações e recomendações
                  </p>
        </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema Premium */}
        <TabsContent value="premium" className="space-y-6">
          {selectedCourseId ? (
            <PremiumCourseSystem courseId={selectedCourseId} />
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <Crown className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-2xl font-semibold text-muted-foreground">
                  Selecione um Curso Premium
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Volte à aba "Grade de Cursos" e clique em qualquer curso para acessar o sistema premium com todas as funcionalidades avançadas.
                </p>
                <Button 
                  onClick={() => setActiveView('grid')}
                  className="mt-4"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Ver Grade de Cursos
                </Button>
              </div>
          </Card>
        )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
