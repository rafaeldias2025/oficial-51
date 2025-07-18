import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CourseModule, CourseLesson } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const useModuleManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateModule = useCallback(async (moduleId: string, updates: Partial<CourseModule>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('course_modules')
        .update({
          title: updates.title,
          description: updates.description,
          image_url: updates.image_url,
          order_index: updates.order_index,
          is_active: updates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Módulo atualizado com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar módulo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar módulo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateLesson = useCallback(async (lessonId: string, updates: Partial<CourseLesson>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('course_lessons')
        .update({
          title: updates.title,
          description: updates.description,
          video_url: updates.video_url,
          duration_minutes: updates.duration_minutes,
          order_index: updates.order_index,
          is_active: updates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aula atualizada com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar aula:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aula",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteModule = useCallback(async (moduleId: string) => {
    try {
      setLoading(true);
      
      // Primeiro, deletar todas as aulas do módulo
      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .update({ is_active: false })
        .eq('module_id', moduleId);

      if (lessonsError) throw lessonsError;

      // Depois, deletar o módulo (soft delete)
      const { error: moduleError } = await supabase
        .from('course_modules')
        .update({ is_active: false })
        .eq('id', moduleId);

      if (moduleError) throw moduleError;

      toast({
        title: "Sucesso",
        description: "Módulo excluído com sucesso!",
      });

    } catch (error: any) {
      console.error('Erro ao excluir módulo:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir módulo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteLesson = useCallback(async (lessonId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('course_lessons')
        .update({ is_active: false })
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aula excluída com sucesso!",
      });

    } catch (error: any) {
      console.error('Erro ao excluir aula:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aula",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const duplicateModule = useCallback(async (module: CourseModule) => {
    try {
      setLoading(true);
      
      // Criar módulo duplicado
      const { data: newModule, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: module.course_id,
          title: `${module.title} (Cópia)`,
          description: module.description,
          image_url: module.image_url,
          order_index: module.order_index + 1,
          is_active: true
        })
        .select()
        .single();

      if (moduleError) throw moduleError;

      // Duplicar aulas do módulo
      if (module.lessons && module.lessons.length > 0) {
        const lessonsToInsert = module.lessons.map(lesson => ({
          module_id: newModule.id,
          title: lesson.title,
          description: lesson.description,
          video_url: lesson.video_url,
          duration_minutes: lesson.duration_minutes,
          order_index: lesson.order_index,
          is_active: true
        }));

        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonsToInsert);

        if (lessonsError) throw lessonsError;
      }

      toast({
        title: "Sucesso",
        description: "Módulo duplicado com sucesso!",
      });

      return newModule;
    } catch (error: any) {
      console.error('Erro ao duplicar módulo:', error);
      toast({
        title: "Erro",
        description: "Erro ao duplicar módulo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    updateModule,
    updateLesson,
    deleteModule,
    deleteLesson,
    duplicateModule
  };
};