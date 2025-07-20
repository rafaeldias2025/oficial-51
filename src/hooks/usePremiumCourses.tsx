import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Tipos simplificados para o sistema premium
interface HeroConfig {
  id?: string;
  course_id: string;
  hero_type: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  hero_video_url?: string;
}

interface ModuleConfig {
  id?: string;
  course_id: string;
  display_mode: string;
  show_module_activation: boolean;
  active_modules?: string[];
}

interface Comment {
  id?: string;
  course_id: string;
  user_id: string;
  comment: string;
  created_at?: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Favorite {
  id?: string;
  course_id: string;
  user_id: string;
  created_at?: string;
}

interface Rating {
  id?: string;
  course_id: string;
  user_id: string;
  rating: number;
  created_at?: string;
}

interface Badge {
  id?: string;
  user_id: string;
  badge_name: string;
  badge_description?: string;
  badge_type?: string;
  earned_at?: string;
}

interface Certificate {
  id?: string;
  user_id: string;
  course_id: string;
  certificate_url?: string;
  issued_at?: string;
}

interface Theme {
  id?: string;
  course_id: string;
  theme_name: string;
  is_dark_mode?: boolean;
  background_color?: string;
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
  user_id?: string;
}

interface Analytics {
  id?: string;
  course_id: string;
  total_views?: number;
  total_completions?: number;
  total_comments?: number;
  total_favorites?: number;
  average_rating?: number;
  engagement_score?: number;
  total_enrollments?: number;
  total_revenue?: number;
  total_reviews?: number;
}

export const usePremiumCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleError = useCallback((error: any, message: string) => {
    console.error(`Erro em ${message}:`, error);
    toast({
      title: "Erro",
      description: message,
      variant: "destructive"
    });
  }, [toast]);

  // Hero Config
  const getHeroConfig = useCallback(async (courseId: string): Promise<HeroConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('course_hero_config')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        course_id: courseId,
        hero_type: 'image',
        hero_title: 'Curso Premium',
        hero_subtitle: 'Descrição do curso premium',
        hero_image_url: 'https://via.placeholder.com/800x400'
      };
    } catch (error) {
      handleError(error, 'Erro ao carregar configuração do hero');
      return null;
    }
  }, [handleError]);

  const updateHeroConfig = useCallback(async (courseId: string, config: Partial<HeroConfig>) => {
    try {
      const { data, error } = await supabase
        .from('course_hero_config')
        .upsert({
          course_id: courseId,
          ...config
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração do hero atualizada",
      });

      return data;
    } catch (error) {
      handleError(error, 'Erro ao atualizar configuração do hero');
      return null;
    }
  }, [handleError, toast]);

  // Module Config
  const getModuleConfig = useCallback(async (courseId: string): Promise<ModuleConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('module_display_config')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        course_id: courseId,
        display_mode: 'direct',
        show_module_activation: true,
        active_modules: ['1', '2', '3']
      };
    } catch (error) {
      handleError(error, 'Erro ao carregar configuração dos módulos');
      return null;
    }
  }, [handleError]);

  const updateModuleConfig = useCallback(async (courseId: string, config: Partial<ModuleConfig>) => {
    try {
      const { data, error } = await supabase
        .from('module_display_config')
        .upsert({
          course_id: courseId,
          ...config
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração dos módulos atualizada",
      });

      return data;
    } catch (error) {
      handleError(error, 'Erro ao atualizar configuração dos módulos');
      return null;
    }
  }, [handleError, toast]);

  // Comments
  const getComments = useCallback(async (courseId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('course_comments')
        .select(`
          *,
          profiles:user_id(full_name, avatar_url)
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, 'Erro ao carregar comentários');
      return [];
    }
  }, [handleError]);

  const addComment = useCallback(async (courseId: string, comment: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('course_comments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          comment
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comentário adicionado",
      });

      return data;
    } catch (error) {
      handleError(error, 'Erro ao adicionar comentário');
      return null;
    }
  }, [user, handleError, toast]);

  // Favorites
  const getFavorites = useCallback(async (courseId: string): Promise<Favorite[]> => {
    try {
      const { data, error } = await supabase
        .from('course_favorites')
        .select('*')
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, 'Erro ao carregar favoritos');
      return [];
    }
  }, [handleError]);

  const toggleFavorite = useCallback(async (courseId: string) => {
    if (!user) return null;

    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('course_favorites')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Remover favorito
        const { error } = await supabase
          .from('course_favorites')
          .delete()
          .eq('course_id', courseId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Favorito removido",
          description: "Curso removido dos favoritos",
        });
      } else {
        // Adicionar favorito
        const { error } = await supabase
          .from('course_favorites')
          .insert({
            course_id: courseId,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Favoritado!",
          description: "Curso adicionado aos favoritos",
        });
      }

      return !existing;
    } catch (error) {
      handleError(error, 'Erro ao alternar favorito');
      return null;
    }
  }, [user, handleError, toast]);

  // Ratings
  const getRatings = useCallback(async (courseId: string): Promise<Rating[]> => {
    try {
      const { data, error } = await supabase
        .from('course_ratings')
        .select('*')
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, 'Erro ao carregar avaliações');
      return [];
    }
  }, [handleError]);

  const addRating = useCallback(async (courseId: string, rating: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('course_ratings')
        .upsert({
          course_id: courseId,
          user_id: user.id,
          rating
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Avaliação registrada",
        description: `Você avaliou com ${rating} estrelas`,
      });

      return data;
    } catch (error) {
      handleError(error, 'Erro ao adicionar avaliação');
      return null;
    }
  }, [user, handleError, toast]);

  // Badges
  const getBadges = useCallback(async (courseId: string): Promise<Badge[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, 'Erro ao carregar badges');
      return [];
    }
  }, [user, handleError]);

  // Certificates
  const generateCertificate = useCallback(async (courseId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_certificates')
        .insert({
          course_id: courseId,
          user_id: user.id,
          certificate_url: `https://example.com/certificates/${courseId}-${user.id}.pdf`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Certificado gerado!",
        description: "Parabéns por completar o curso",
      });

      return data;
    } catch (error) {
      handleError(error, 'Erro ao gerar certificado');
      return null;
    }
  }, [user, handleError, toast]);

  // Theme
  const getTheme = useCallback(async (courseId: string): Promise<Theme | null> => {
    try {
      const { data, error } = await supabase
        .from('course_themes')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        course_id: courseId,
        theme_name: 'light',
        is_dark_mode: false
      };
    } catch (error) {
      handleError(error, 'Erro ao carregar tema');
      return null;
    }
  }, [handleError]);

  const updateTheme = useCallback(async (courseId: string, theme: Partial<Theme>) => {
    try {
      const { data, error } = await supabase
        .from('course_themes')
        .upsert({
          course_id: courseId,
          theme_name: theme.theme_name || 'default',
          ...theme
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Tema atualizado",
        description: "Configuração de tema salva",
      });

      return data;
    } catch (error) {
      handleError(error, 'Erro ao atualizar tema');
      return null;
    }
  }, [handleError, toast]);

  // Analytics
  const getAnalytics = useCallback(async (courseId: string): Promise<Analytics | null> => {
    try {
      const { data, error } = await supabase
        .from('course_analytics')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        course_id: courseId,
        total_views: 0,
        total_completions: 0,
        total_comments: 0,
        total_favorites: 0,
        average_rating: 0,
        engagement_score: 0
      };
    } catch (error) {
      handleError(error, 'Erro ao carregar analytics');
      return null;
    }
  }, [handleError]);

  return {
    getHeroConfig,
    updateHeroConfig,
    getModuleConfig,
    updateModuleConfig,
    getComments,
    addComment,
    getFavorites,
    toggleFavorite,
    getRatings,
    addRating,
    getBadges,
    generateCertificate,
    getTheme,
    updateTheme,
    getAnalytics
  };
}; 