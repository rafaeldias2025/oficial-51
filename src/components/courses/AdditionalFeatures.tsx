import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trophy, FileText, Download, Moon, Sun, Target, Award } from 'lucide-react';
import { usePremiumCourses } from '@/hooks/usePremiumCourses';
import { Badge as BadgeType, Certificate, Theme } from '@/types/premium';
import { useAuth } from '@/hooks/useAuth';

interface AdditionalFeaturesProps {
  courseId: string;
  isAdmin?: boolean;
}

export const AdditionalFeatures: React.FC<AdditionalFeaturesProps> = ({ courseId, isAdmin = false }) => {
  const { user } = useAuth();
  const {
    getBadges,
    generateCertificate,
    getTheme,
    updateTheme
  } = usePremiumCourses();

  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data para demonstração
  const mockProgress = 75;
  const mockModules = [
    { id: '1', title: 'Introdução', completed: true, progress: 100 },
    { id: '2', title: 'Fundamentos', completed: true, progress: 100 },
    { id: '3', title: 'Prática', completed: false, progress: 50 },
    { id: '4', title: 'Avançado', completed: false, progress: 0 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [badgesData, themeData] = await Promise.all([
          getBadges(courseId),
          getTheme(courseId)
        ]);

        setBadges(badgesData);
        if (themeData) {
          setTheme(themeData);
          setIsDarkMode(themeData.is_dark_mode);
        }
        
        setProgress(mockProgress);
      } catch (error) {
        console.error('Erro ao carregar funcionalidades adicionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, getBadges, getTheme]);

  const handleGenerateCertificate = async () => {
    if (!user) return;

    const certificate = await generateCertificate(courseId);
    if (certificate) {
      // Adicionar certificado à lista local (se necessário)
      console.log('Certificado gerado:', certificate);
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    await updateTheme(courseId, {
      theme_name: newTheme ? 'dark' : 'light',
      is_dark_mode: newTheme
    });

    // Recarregar tema
    const updatedTheme = await getTheme(courseId);
    if (updatedTheme) {
      setTheme(updatedTheme);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Progresso Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Progresso do Curso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Geral</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Progresso por Módulo</h4>
              {mockModules.map(module => (
                <div key={module.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{module.title}</span>
                    <div className="flex items-center space-x-2">
                      {module.completed && (
                        <Award className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {module.progress}%
                      </span>
                    </div>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges e Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Badges e Conquistas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full">
            <div className="grid gap-3">
              {badges.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum badge conquistado ainda. Continue estudando para desbloquear conquistas!
                </p>
              ) : (
                badges.map(badge => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{badge.badge_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {badge.badge_description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {badge.badge_type}
                        </Badge>
                        {badge.earned_at && (
                          <span className="text-xs text-muted-foreground">
                            Conquistado em {new Date(badge.earned_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Certificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Certificados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress >= 100 ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-700">Parabéns!</h4>
                  <p className="text-sm text-muted-foreground">
                    Você completou o curso e pode gerar seu certificado.
                  </p>
                </div>
                <Button onClick={handleGenerateCertificate} disabled={!user}>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Certificado
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Certificado Bloqueado</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete 100% do curso para desbloquear o certificado.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Progresso atual: {progress}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Tema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>Tema do Curso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Modo Noturno</Label>
              <p className="text-sm text-muted-foreground">
                Ative o modo escuro para uma experiência mais confortável
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {mockModules.filter(m => m.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Módulos Completos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 