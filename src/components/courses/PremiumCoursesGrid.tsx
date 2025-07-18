import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Play, 
  Lock, 
  Settings, 
  Clock, 
  Users, 
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCourseManagement, Course } from '@/hooks/useCourseManagement';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminCourseManager } from './AdminCourseManager';

interface PremiumCoursesGridProps {
  onCourseSelect?: (course: Course) => void;
  className?: string;
}

export const PremiumCoursesGrid: React.FC<PremiumCoursesGridProps> = ({
  onCourseSelect,
  className = ""
}) => {
  const { courses, loading, error } = useCourseManagement();
  const { isAdmin } = useAdminAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAdminManager, setShowAdminManager] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  // Mock instructor and stats data (will come from database later)
  const getMockCourseData = (course: Course) => ({
    instructor: 'Dr. Ana Silva',
    studentsCount: Math.floor(Math.random() * 5000) + 100,
    rating: 4.8,
    totalLessons: Math.floor(Math.random() * 20) + 5,
    totalDuration: `${Math.floor(Math.random() * 10) + 2}h ${Math.floor(Math.random() * 60)}min`
  });

  const formatPrice = (price: number | null) => {
    if (!price) return 'Gratuito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      'Nutrição': 'bg-green-500',
      'Psicologia': 'bg-purple-500', 
      'Atividade Física': 'bg-blue-500',
      'Wellness': 'bg-pink-500',
      'general': 'bg-gray-500'
    };
    return colors[category || 'general'] || 'bg-gray-500';
  };

  const handleCourseClick = (course: Course) => {
    if (onCourseSelect) {
      onCourseSelect(course);
    } else {
      // Default behavior - could navigate to course page
      console.log('Opening course:', course.title);
    }
  };

  const handleAdminManage = (course: Course, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCourse(course);
    setShowAdminManager(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-destructive mb-2">Erro ao carregar cursos</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum curso disponível</h3>
        <p className="text-muted-foreground">
          {isAdmin ? 'Crie o primeiro curso premium!' : 'Novos cursos em breve!'}
        </p>
        {isAdmin && (
          <Button 
            onClick={() => setShowAdminManager(true)}
            className="mt-4"
          >
            Criar Primeiro Curso
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-8 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cursos Premium
            </h1>
            <p className="text-muted-foreground mt-2">
              Conteúdos exclusivos para transformar sua jornada de saúde e bem-estar
            </p>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setShowAdminManager(true)}
              variant="outline"
              className="hidden md:flex"
            >
              <Settings className="w-4 h-4 mr-2" />
              Gerenciar Cursos
            </Button>
          )}
        </div>

        {/* Stats */}
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {courses.map((course, index) => {
              const mockData = getMockCourseData(course);
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredCourse(course.id)}
                  onHoverEnd={() => setHoveredCourse(null)}
                >
                  <Card 
                    className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  >
                    {/* Course Cover */}
                    <div className="relative h-48 overflow-hidden">
                      {course.image_url ? (
                        <img 
                          src={course.image_url} 
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <GraduationCap className="w-16 h-16 text-primary/50" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: hoveredCourse === course.id ? 1 : 0,
                            scale: hoveredCourse === course.id ? 1 : 0.8
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button size="lg" className="rounded-full">
                            <Play className="w-6 h-6" />
                          </Button>
                        </motion.div>
                      </div>

                      {/* Category Badge */}
                      <Badge 
                        className={`absolute top-3 left-3 ${getCategoryColor(course.category)} text-white border-0`}
                      >
                        {course.category || 'Geral'}
                      </Badge>

                      {/* Admin Controls */}
                      {isAdmin && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleAdminManage(course, e)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Status */}
                      {!course.is_active && (
                        <Badge variant="destructive" className="absolute bottom-3 right-3">
                          Inativo
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {course.description || 'Descrição não disponível'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Course Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{mockData.totalDuration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          <span>{mockData.totalLessons} aulas</span>
                        </div>
                      </div>

                      {/* Rating and Students */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-medium">{mockData.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{mockData.studentsCount.toLocaleString()} alunos</span>
                        </div>
                      </div>

                      {/* Instructor */}
                      <div className="text-sm">
                        <span className="text-muted-foreground">Instrutor: </span>
                        <span className="font-medium">{mockData.instructor}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between pt-0">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(course.price)}
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Lock className="w-4 h-4 mr-2" />
                        Acessar
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Admin Course Manager Modal */}
      {showAdminManager && (
        <AdminCourseManager 
          course={selectedCourse}
          open={showAdminManager}
          onClose={() => {
            setShowAdminManager(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </>
  );
}; 