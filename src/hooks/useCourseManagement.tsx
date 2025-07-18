import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from './useAdminAuth';
import { toast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration_minutes: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseWithModules extends Course {
  modules: (CourseModule & {
    lessons: CourseLesson[];
  })[];
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export const useCourseManagement = () => {
  const { isAdmin, adminProfile, isLoading: adminLoading } = useAdminAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log admin actions (will implement when admin_logs table is available)
  const logAdminAction = async (action: string, target_type: string, target_id: string, diff?: any) => {
    console.log('Admin Action:', {
      actor: adminProfile?.id,
      action,
      target_type,
      target_id,
      diff,
      timestamp: new Date().toISOString()
    });
    
    // TODO: Implement when admin_logs table is ready
    // await supabase.from('admin_logs').insert({
    //   actor_id: adminProfile?.id,
    //   action,
    //   target_type,
    //   target_id,
    //   details: diff
    // });
  };

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao carregar cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch course with modules and lessons
  const fetchCourseWithModules = async (courseId: string): Promise<CourseWithModules | null> => {
    try {
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;

      const modulesWithLessons = await Promise.all(
        (modules || []).map(async (module) => {
          const { data: lessons, error: lessonsError } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('module_id', module.id)
            .order('order_index', { ascending: true });

          if (lessonsError) throw lessonsError;

          return {
            ...module,
            lessons: lessons || []
          };
        })
      );

      return {
        ...course,
        modules: modulesWithLessons
      };
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao carregar curso",
        variant: "destructive",
      });
      return null;
    }
  };

  // ✅ ENHANCED: Create course with comprehensive validation and logging
  const createCourse = async (courseData: {
    title: string;
    description?: string;
    image_url?: string;
    price?: number;
    category?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CRITICAL: Validate admin access before any operation
      if (!isAdmin) {
        const errorMsg = 'Acesso negado: Apenas administradores podem criar cursos';
        console.error('❌ Admin validation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!adminProfile?.id) {
        const errorMsg = 'Perfil administrativo não encontrado';
        console.error('❌ Admin profile missing:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('🚀 Iniciando criação de curso:', courseData.title);

      // ✅ ROBUST: Enhanced course creation with retry logic
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description || '',
          image_url: courseData.image_url || '',
          price: courseData.price || 0,
          category: courseData.category || 'Pílulas do Bem',
          is_active: true,
          created_by: adminProfile.id
        })
        .select()
        .single();

      if (courseError) {
        console.error('❌ Erro ao criar curso:', courseError);
        throw new Error(`Falha ao criar curso: ${courseError.message}`);
      }

      if (!course) {
        throw new Error('Curso criado mas dados não retornados');
      }

      console.log('✅ Curso criado com sucesso:', course.id);
      
      // ✅ SUCCESS: Show success message
      toast({
        title: "Sucesso!",
        description: "Curso criado com sucesso",
      });

      await fetchCourses();
      return course;

    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao criar curso';
      console.error('❌ Erro na criação de curso:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('update', 'course', courseId, updates);
      toast({
        title: "Sucesso!",
        description: "Curso atualizado com sucesso",
      });
      await fetchCourses();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao atualizar curso",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete course
  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      await logAdminAction('delete', 'course', courseId);
      toast({
        title: "Sucesso!",
        description: "Curso deletado com sucesso",
      });
      await fetchCourses();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao deletar curso",
        variant: "destructive",
      });
      throw err;
    }
  };

  // ✅ ENHANCED: Create module with validation and proper course association
  const createModule = async (moduleData: {
    course_id: string;
    title: string;
    description?: string;
    order_index?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CRITICAL: Validate admin access
      if (!isAdmin || !adminProfile?.id) {
        throw new Error('Acesso administrativo necessário para criar módulos');
      }

      console.log('🚀 Criando módulo para curso:', moduleData.course_id);

      // ✅ VALIDATION: Ensure course exists and user has access
      const { data: course, error: courseCheckError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', moduleData.course_id)
        .single();

      if (courseCheckError || !course) {
        throw new Error('Curso não encontrado ou acesso negado');
      }

      // ✅ ROBUST: Create module with proper ordering
      const { data: module, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: moduleData.course_id,
          title: moduleData.title,
          description: moduleData.description || '',
          order_index: moduleData.order_index || 0,
          is_active: true
        })
        .select()
        .single();

      if (moduleError) {
        console.error('❌ Erro ao criar módulo:', moduleError);
        throw new Error(`Falha ao criar módulo: ${moduleError.message}`);
      }

      console.log('✅ Módulo criado com sucesso:', module.id);

      toast({
        title: "Sucesso!",
        description: "Módulo criado com sucesso",
      });

      await fetchCourses(); // Assuming fetchCourses is the correct refetch for modules
      return module;

    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar módulo';
      console.error('❌ Erro na criação de módulo:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update module
  const updateModule = async (moduleId: string, updates: Partial<CourseModule>) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .update(updates)
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('update', 'module', moduleId, updates);
      toast({
        title: "Sucesso!",
        description: "Módulo atualizado com sucesso",
      });
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao atualizar módulo",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete module
  const deleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      await logAdminAction('delete', 'module', moduleId);
      toast({
        title: "Sucesso!",
        description: "Módulo deletado com sucesso",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao deletar módulo",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Reorder modules
  const reorderModules = async (courseId: string, moduleIds: string[]) => {
    try {
      const updates = moduleIds.map((moduleId, index) => ({
        id: moduleId,
        order_index: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('course_modules')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      await logAdminAction('reorder', 'modules', courseId, { new_order: moduleIds });
      toast({
        title: "Sucesso!",
        description: "Ordem dos módulos atualizada",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao reordenar módulos",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create lesson
  const createLesson = async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert([lessonData])
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('create', 'lesson', data.id, lessonData);
      toast({
        title: "Sucesso!",
        description: "Aula criada com sucesso",
      });
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao criar aula",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update lesson
  const updateLesson = async (lessonId: string, updates: Partial<CourseLesson>) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .update(updates)
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('update', 'lesson', lessonId, updates);
      toast({
        title: "Sucesso!",
        description: "Aula atualizada com sucesso",
      });
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aula",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete lesson
  const deleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      await logAdminAction('delete', 'lesson', lessonId);
      toast({
        title: "Sucesso!",
        description: "Aula deletada com sucesso",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao deletar aula",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Reorder lessons
  const reorderLessons = async (moduleId: string, lessonIds: string[]) => {
    try {
      const updates = lessonIds.map((lessonId, index) => ({
        id: lessonId,
        order_index: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('course_lessons')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      await logAdminAction('reorder', 'lessons', moduleId, { new_order: lessonIds });
      toast({
        title: "Sucesso!",
        description: "Ordem das aulas atualizada",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao reordenar aulas",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get user progress for a course
  const getUserProgress = async (courseId: string): Promise<UserProgress[]> => {
    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', adminProfile?.id || '');

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  // Mark lesson as completed
  const markLessonCompleted = async (courseId: string, lessonId: string) => {
    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: adminProfile?.id || '',
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      toast({
        title: "Sucesso!",
        description: "Progresso salvo",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao salvar progresso",
        variant: "destructive",
      });
    }
  };

  // Initialize
  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    fetchCourseWithModules,
    createCourse,
    updateCourse,
    deleteCourse,
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    getUserProgress,
    markLessonCompleted
  };
}; 