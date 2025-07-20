import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { 
  CourseModule, 
  CourseLesson, 
  UserCourseProgress, 
  UserProfile 
} from '@/types/admin';

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  cover_video_url?: string;
  instructor?: string;
  duration?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  rating?: number;
  tags?: string[];
  is_premium?: boolean;
  hero_type?: 'image' | 'video';
  hero_url?: string;
  module_display_mode?: 'direct' | 'course-based';
  active_modules?: string[];
  total_comments?: number;
  total_favorites?: number;
  average_rating?: number;
  completion_rate?: number;
  modules?: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      type: 'video' | 'text' | 'quiz';
      completed: boolean;
    }>;
  }>;
}

export const useCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // ✅ PERFORMANCE: Memoize admin check to avoid repeated queries
  const isAdmin = useMemo(() => {
    return userProfile?.role === 'admin';
  }, [userProfile?.role]);

  // ✅ PERFORMANCE: Fetch user profile once and cache it
  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, role, full_name, avatar_url, created_at, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      setUserProfile(null);
      return null;
    }
  }, [user?.id]);

  // ✅ PERFORMANCE: Memoized fetch courses function
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          image_url,
          category,
          price,
          is_active,
          created_by,
          created_at,
          updated_at,
          is_premium,
          hero_type,
          hero_url,
          module_display_mode,
          active_modules,
          total_comments,
          total_favorites,
          average_rating,
          completion_rate
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar cursos:', err);
      setError('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ENHANCED: Create course with proper validation
  const createCourse = useCallback(async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (!userProfile) throw new Error('Perfil do usuário não encontrado');
      if (!isAdmin) throw new Error('Acesso negado: apenas administradores podem criar cursos');

      const { data, error } = await supabase
        .from('courses')
        .insert([{ 
          ...courseData, 
          created_by: userProfile.id,
          is_premium: courseData.is_premium || false,
          hero_type: courseData.hero_type || 'image',
          module_display_mode: courseData.module_display_mode || 'direct',
          active_modules: courseData.active_modules || [],
          total_comments: 0,
          total_favorites: 0,
          average_rating: 0,
          completion_rate: 0
        }])
        .select(`
          id,
          title,
          description,
          image_url,
          category,
          price,
          is_active,
          created_by,
          created_at,
          updated_at,
          is_premium,
          hero_type,
          hero_url,
          module_display_mode,
          active_modules,
          total_comments,
          total_favorites,
          average_rating,
          completion_rate
        `)
        .maybeSingle();

      if (error) throw error;
      
      setCourses(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Erro ao criar curso:', err);
      throw new Error(err.message || 'Erro ao criar curso');
    }
  }, [user, userProfile, isAdmin]);

  // ✅ ENHANCED: Update course with validation
  const updateCourse = useCallback(async (courseId: string, updates: Partial<Course>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (!isAdmin) throw new Error('Acesso negado: apenas administradores podem atualizar cursos');

      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .select(`
          id,
          title,
          description,
          image_url,
          category,
          price,
          is_active,
          created_by,
          created_at,
          updated_at,
          is_premium,
          hero_type,
          hero_url,
          module_display_mode,
          active_modules,
          total_comments,
          total_favorites,
          average_rating,
          completion_rate
        `)
        .maybeSingle();

      if (error) throw error;
      
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, ...data } : course
      ));
      
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar curso:', err);
      throw err;
    }
  }, [user, isAdmin]);

  // ✅ ENHANCED: Soft delete course
  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (!isAdmin) throw new Error('Acesso negado: apenas administradores podem deletar cursos');

      const { error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId);

      if (error) throw error;
      
      // Remove from local state since we only show active courses
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (err: any) {
      console.error('Erro ao deletar curso:', err);
      throw err;
    }
  }, [user, isAdmin]);

  // ✅ PERFORMANCE: Optimized query for course modules with left join
  const fetchCourseModules = useCallback(async (courseId: string): Promise<CourseModule[]> => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          id,
          course_id,
          title,
          description,
          image_url,
          order_index,
          is_active,
          created_at,
          updated_at,
          course_lessons (
            id,
            module_id,
            title,
            description,
            video_url,
            duration_minutes,
            order_index,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      return data?.map(module => ({
        id: module.id,
        course_id: module.course_id,
        title: module.title,
        description: module.description,
        order_index: module.order_index,
        is_active: module.is_active,
        created_at: module.created_at,
        updated_at: module.updated_at,
        lessons: (module.course_lessons || [])
          .filter((lesson: any) => lesson.is_active)
          .sort((a: any, b: any) => a.order_index - b.order_index)
      })) || [];
    } catch (err: any) {
      console.error('Erro ao buscar módulos:', err);
      throw err;
    }
  }, []);

  // ✅ ENHANCED: Create module with validation
  const createModule = useCallback(async (moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>): Promise<CourseModule> => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (!isAdmin) throw new Error('Acesso negado: apenas administradores podem criar módulos');

      const { data, error } = await supabase
        .from('course_modules')
        .insert([moduleData])
        .select(`
          id,
          course_id,
          title,
          description,
          order_index,
          is_active,
          created_at,
          updated_at
        `)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Erro ao criar módulo:', err);
      throw err;
    }
  }, [user, isAdmin]);

  // ✅ ENHANCED: Create lesson with validation
  const createLesson = useCallback(async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>): Promise<CourseLesson> => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (!isAdmin) throw new Error('Acesso negado: apenas administradores podem criar aulas');

      const { data, error } = await supabase
        .from('course_lessons')
        .insert([{
          module_id: lessonData.module_id,
          title: lessonData.title,
          description: lessonData.description,
          video_url: lessonData.video_url || '',
          duration_minutes: lessonData.duration_minutes,
          order_index: lessonData.order_index,
          is_active: lessonData.is_active
        }])
        .select(`
          id,
          module_id,
          title,
          description,
          video_url,
          duration_minutes,
          order_index,
          is_active,
          created_at,
          updated_at
        `)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Erro ao criar aula:', err);
      throw err;
    }
  }, [user, isAdmin]);

  // ✅ ENHANCED: Mark lesson as completed with proper validation
  const markLessonAsCompleted = useCallback(async (courseId: string, lessonId: string) => {
    if (!user || !userProfile) {
      throw new Error('Usuário não autenticado ou perfil não encontrado');
    }

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: userProfile.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao marcar aula como concluída:', err);
      throw err;
    }
  }, [user, userProfile]);

  // ✅ ENHANCED: Get user progress with proper typing
  const getUserProgress = useCallback(async (courseId: string): Promise<UserCourseProgress[]> => {
    if (!user || !userProfile) return [];

    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select(`
          id,
          user_id,
          course_id,
          lesson_id,
          completed,
          completed_at,
          created_at,
          updated_at
        `)
        .eq('user_id', userProfile.id)
        .eq('course_id', courseId);

      if (error) throw error;
      return data?.map(item => ({
        ...item,
        progress_percentage: item.completed ? 100 : 0
      })) || [];
    } catch (err: any) {
      console.error('Erro ao buscar progresso:', err);
      return [];
    }
  }, [user, userProfile]);

  // ✅ EFFECT: Load user profile first, then courses
  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await fetchUserProfile();
      }
    };
    
    initializeData();
  }, [user, fetchUserProfile]);

  // ✅ EFFECT: Load courses after profile is loaded
  useEffect(() => {
    if (userProfile !== undefined) { // Check for both null and loaded state
      fetchCourses();
    }
  }, [userProfile, fetchCourses]);

  return {
    courses,
    loading,
    error,
    isAdmin,
    userProfile,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourseModules,
    createModule,
    createLesson,
    markLessonAsCompleted,
    getUserProgress,
    refreshProfile: fetchUserProfile
  };
};