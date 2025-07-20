import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Settings, 
  Lock, 
  GraduationCap,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/hooks/useCourseManagement';
import { CelebratoryCourseCover } from './CelebratoryCourseCover';
import { useNavigate } from 'react-router-dom';

interface PremiumCoursesGridProps {
  onCourseSelect?: (course: Course) => void;
  className?: string;
}

export const PremiumCoursesGrid: React.FC<PremiumCoursesGridProps> = ({
  onCourseSelect,
  className = ""
}) => {
  const navigate = useNavigate();
  const { courses, loading, isAdmin } = useCourses();
  const { user } = useAuth();
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  const getMockCourseData = (course: Course) => ({
    totalDuration: '2h 30m',
    totalLessons: 12,
    rating: 4.8,
    studentsCount: 1247,
    instructor: 'Dr. Rafael Silva'
  });

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return 'Grátis';
    return `R$ ${price.toFixed(2)}`;
  };

  const getCategoryColor = (category: string | null) => {
    const colors = {
      'Saúde': 'bg-green-500',
      'Bem-estar': 'bg-blue-500',
      'Fitness': 'bg-purple-500',
      'Nutrição': 'bg-orange-500',
      'Psicologia': 'bg-pink-500',
      'Geral': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors['Geral'];
  };

  const handleCourseClick = (course: Course) => {
    onCourseSelect?.(course);
  };

  const handleEditCourse = (course: Course) => {
    navigate(`/admin/courses/${course.id}/edit`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    // Implementar deleção
    console.log('Delete course:', courseId);
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum curso disponível</h3>
        <p className="text-muted-foreground">Os cursos aparecerão aqui quando estiverem disponíveis.</p>
      </div>
    );
  }

  return (
    <>
      <div className={className}>
        {/* Hero Section - Capa no Topo */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent mb-8">
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

        {/* Courses Grid */}
        <div className="container mx-auto px-4">
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
                      {/* Celebratory Course Cover */}
                      <div className="relative h-48 overflow-hidden">
                        <CelebratoryCourseCover
                          title={course.title}
                          category={course.category}
                          size="lg"
                          className="w-full h-full"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center z-10">
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

                        {/* Admin Controls - Apenas para Admin */}
                        {isAdmin && (
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <div className="flex gap-1">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="w-8 h-8"
                                onClick={(e) => handleEditCourse(course)}
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="w-8 h-8"
                                onClick={(e) => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Status */}
                        {!course.is_active && (
                          <Badge variant="destructive" className="absolute bottom-3 right-3 z-20">
                            Inativo
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        {/* Removed description to avoid cluttering the cover */}
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
      </div>
    </>
  );
}; 