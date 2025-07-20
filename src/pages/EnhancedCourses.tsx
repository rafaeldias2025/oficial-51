import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Settings,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { EnhancedCourseGrid } from '@/components/courses/EnhancedCourseGrid';
import { useCourses, Course } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const EnhancedCourses: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    courses, 
    loading, 
    isAdmin, 
    updateCourse, 
    deleteCourse,
    fetchCourses 
  } = useCourses();

  const handleCourseClick = (course: Course) => {
    navigate(`/courses/${course.id}`);
  };

  const handleEditCourse = (course: Course) => {
    navigate(`/admin/courses/${course.id}/edit`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (courseId: string, isActive: boolean) => {
    try {
      await updateCourse(courseId, { is_active: isActive });
      toast({
        title: "Success",
        description: `Course ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Capa no Topo */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cursos Premium
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Conteúdos exclusivos para transformar sua jornada de saúde e bem-estar
            </p>
            
            {/* Admin Controls - Apenas para Admin */}
            {isAdmin && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Badge variant="outline" className="text-sm">
                  Modo Administrador
                </Badge>
                <Button onClick={() => navigate('/admin')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats - Apenas para Admin */}
      {isAdmin && (
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                <div className="text-sm text-blue-600/80">Cursos Disponíveis</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.is_active).length}
                </div>
                <div className="text-sm text-green-600/80">Ativos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(courses.map(c => c.category)).size}
                </div>
                <div className="text-sm text-purple-600/80">Categorias</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">4.8</div>
                <div className="text-sm text-amber-600/80">Avaliação Média</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="container mx-auto px-4 pb-12">
        {courses.length > 0 ? (
          <EnhancedCourseGrid
            onCourseSelect={(courseId) => {
              const course = courses.find(c => c.id === courseId);
              if (course) handleCourseClick(course);
            }}
          />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50">📚</div>
                <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
                <p>Os cursos aparecerão aqui quando estiverem disponíveis.</p>
              </div>
              {isAdmin && (
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/admin')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ir para Admin
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedCourses;