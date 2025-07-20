import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Play, Clock, Users, Star } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';

interface EnhancedCourseGridProps {
  onCourseSelect?: (courseId: string) => void;
  selectedCourseId?: string | null;
}

export const EnhancedCourseGrid: React.FC<EnhancedCourseGridProps> = ({
  onCourseSelect,
  selectedCourseId
}) => {
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="h-48 bg-muted rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            selectedCourseId === course.id 
              ? 'ring-2 ring-primary ring-offset-2 shadow-lg' 
              : ''
          }`}
          onClick={() => onCourseSelect?.(course.id)}
        >
          <CardContent className="p-0">
            {/* Imagem do Curso */}
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={course.image_url || '/placeholder.svg'}
                alt={course.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Badge Premium */}
              {course.is_premium && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}

              {/* Botão Play */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                  <Play className="h-4 w-4 mr-1" />
                  Acessar
                </Button>
            </div>

              {/* Indicador de Seleção */}
              {selectedCourseId === course.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
            </div>
              )}
          </div>

            {/* Conteúdo do Card */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </div>

              {/* Categoria */}
              <Badge variant="secondary" className="text-xs">
                  {course.category}
                </Badge>

              {/* Métricas */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  {course.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Alunos</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preço */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-primary">
                  {course.price > 0 ? `R$ ${course.price.toFixed(2)}` : 'Gratuito'}
                </div>
                {course.progress && (
                  <div className="text-sm text-muted-foreground">
                    {course.progress}% completo
                  </div>
                )}
              </div>

              {/* Progresso (se existir) */}
              {course.progress && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};