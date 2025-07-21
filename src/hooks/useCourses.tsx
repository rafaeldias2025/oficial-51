import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  is_premium?: boolean;
  is_active?: boolean;
  category?: string;
  created_at: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  course_id: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao carregar módulos:', err);
      return [];
    }
  };

  const getUserProgress = async (userId: string, courseId: string) => {
    // Simulação de progresso do usuário
    return {
      completed_lessons: 3,
      total_lessons: 10,
      progress_percentage: 30
    };
  };

  const markLessonAsCompleted = async (userId: string, lessonId: string) => {
    // Simulação de marcação de aula como concluída
    console.log('Aula marcada como concluída:', lessonId);
    return { success: true };
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId);

      if (error) throw error;
      await fetchCourses(); // Recarrega a lista
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar curso:', err);
      return { success: false, error: err };
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      await fetchCourses(); // Recarrega a lista
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar curso:', err);
      return { success: false, error: err };
    }
  };

  // Verificar se o usuário é admin (simulação)
  const isAdmin = true; // Em produção, isso viria do contexto de autenticação

  useEffect(() => {
    fetchCourses();
  }, []);

  return { 
    courses, 
    loading, 
    error, 
    isAdmin,
    fetchCourseModules,
    getUserProgress,
    markLessonAsCompleted,
    updateCourse,
    deleteCourse,
    fetchCourses
  };
}; 