import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interface compatível com a estrutura existente da tabela courses
interface CourseData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Campos existentes na tabela
  category?: string;
  created_by?: string;
  difficulty_level?: string;
  duration_hours?: number;
  instructor_name?: string;
  price?: number;
  rating?: number;
  total_students?: number;
  // Campos novos para a plataforma
  type?: 'CURSO' | 'MÓDULO' | 'AULA';
  show_title?: boolean;
  order_index?: number;
}

export const usePlataforma = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData: Omit<CourseData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar curso');
      throw err;
    }
  };

  const updateCourse = async (id: string, updates: Partial<CourseData>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => prev.map(course => 
        course.id === id ? data : course
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar curso');
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar curso');
      throw err;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refetch: fetchCourses
  };
}; 