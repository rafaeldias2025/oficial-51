import React from 'react';
import { EnhancedCourseGrid } from './EnhancedCourseGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Star, Crown, Users, Clock, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/hooks/useCourses';

export const PaidCourses = () => {
  const { courses, loading } = useCourses();
  const navigate = useNavigate();

  const handleCourseClick = (course: Course) => {
    navigate(`/course/${course.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-netflix-bg via-background to-netflix-bg flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Carregando cursos...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-bg via-background to-netflix-bg">
      {/* Hero Section */}
      <div className="relative py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                Cursos Premium
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforme sua vida com nossos cursos exclusivos. Acesso ilimitado a conteúdo premium 
              desenvolvido por especialistas em transformação pessoal.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">5.000+</div>
                  <div className="text-sm text-muted-foreground">Alunos Transformados</div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-primary/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Horas de Conteúdo</div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-primary/20">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
              <Link to="/courses">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Explorar Todos os Cursos
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 • Avaliação dos alunos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Course Grid */}
      <div className="container mx-auto px-6 pb-16">
        <EnhancedCourseGrid 
          courses={courses} 
          onCourseClick={handleCourseClick}
        />
      </div>
    </div>
  );
};
