import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedLessonPlayer } from '@/components/courses/EnhancedLessonPlayer';
import { useCourses } from '@/hooks/useCourses';
import { CourseModule } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const LessonPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { toast } = useToast();
  const { fetchCourseModules } = useCourses();
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const courseModules = await fetchCourseModules(courseId);
        setModules(courseModules);
      } catch (error) {
        console.error('Error loading modules:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar módulos do curso.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId, fetchCourseModules, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Carregando aula...</p>
        </div>
      </div>
    );
  }

  if (!courseId || !lessonId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white">Parâmetros inválidos</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedLessonPlayer
      courseId={courseId}
      lessonId={lessonId}
      modules={modules}
    />
  );
};

export default LessonPlayerPage;