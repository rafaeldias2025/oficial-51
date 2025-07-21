import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'visitor';
  created_at: string;
}

interface UserAuth {
  id: string;
  email: string;
  aud: string;
  role?: string;
}

export const useAdminAuth = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ SECURE: Get admin emails from environment variables
  const getAdminEmails = useCallback((): string[] => {
    const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS;
    if (!adminEmailsEnv) {
      logger.warn('VITE_ADMIN_EMAILS não configurado', undefined, 'useAdminAuth');
      return [];
    }
    return adminEmailsEnv.split(',').map((email: string) => email.trim());
  }, []);

  // ✅ ENHANCED: Create admin profile with proper error handling and retry logic
  const createAdminProfile = useCallback(async (userAuth: UserAuth): Promise<AdminProfile | null> => {
    const adminEmails = getAdminEmails();
    
    if (!userAuth?.email || !adminEmails.includes(userAuth.email)) {
      throw new Error('Email não autorizado para acesso administrativo');
    }

    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        logger.debug(`Tentativa ${attempt + 1} de criar perfil admin`, { email: userAuth.email }, 'useAdminAuth');
        
        // First, try to find existing profile
        const { data: existingProfile, error: queryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userAuth.id)
          .maybeSingle();

        if (existingProfile && !queryError) {
          logger.info('Perfil admin existente encontrado', { profileId: existingProfile.id }, 'useAdminAuth');
          // Update to ensure admin role
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ 
              role: 'admin' as const,
              email: userAuth.email 
            })
            .eq('id', existingProfile.id)
            .select()
            .maybeSingle();

          if (updateError) throw updateError;
          return {
            id: updatedProfile.id,
            email: updatedProfile.email,
            role: updatedProfile.role,
            created_at: updatedProfile.created_at
          };
        }

        // Create new admin profile if not exists
        const newProfile = {
          user_id: userAuth.id,
          email: userAuth.email,
          role: 'admin' as const,
          full_name: userAuth.email.split('@')[0],
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .maybeSingle();

        if (createError) {
          if (createError.code === '23505') { // Unique constraint violation
            logger.warn('Perfil já existe, tentando buscar novamente', { attempt }, 'useAdminAuth');
            attempt++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw createError;
        }

        logger.info('Perfil admin criado com sucesso', { profileId: createdProfile.id }, 'useAdminAuth');
        return {
          id: createdProfile.id,
          email: createdProfile.email,
          role: createdProfile.role,
          created_at: createdProfile.created_at
        };

      } catch (error: any) {
        logger.error(`Erro na tentativa ${attempt + 1}`, error, 'useAdminAuth');
        attempt++;
        
        if (attempt >= maxRetries) {
          throw new Error(`Falha ao criar perfil admin após ${maxRetries} tentativas: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
    
    return null;
  }, [getAdminEmails]);

  // ✅ ENHANCED: Comprehensive admin verification with profile management
  const verifyAdminAccess = useCallback(async (userAuth: UserAuth) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!userAuth?.email) {
        setIsAdmin(false);
        setAdminProfile(null);
        return;
      }

      const adminEmails = getAdminEmails();
      
      // Check if email is in admin list
      if (!adminEmails.includes(userAuth.email)) {
        logger.debug('Email não está na lista de administradores', { email: userAuth.email }, 'useAdminAuth');
        setIsAdmin(false);
        setAdminProfile(null);
        return;
      }

      logger.info('Verificando/criando perfil admin', { email: userAuth.email }, 'useAdminAuth');
      
      // Get or create admin profile
      const profile = await createAdminProfile(userAuth);
      
      if (profile && profile.role === 'admin') {
        logger.info('Acesso admin verificado com sucesso', { profileId: profile.id }, 'useAdminAuth');
        setIsAdmin(true);
        setAdminProfile(profile);
      } else {
        logger.warn('Perfil não é admin ativo', { profile }, 'useAdminAuth');
        setIsAdmin(false);
        setAdminProfile(null);
      }

    } catch (error: any) {
      logger.error('Erro na verificação de admin', error, 'useAdminAuth');
      setError(error.message);
      setIsAdmin(false);
      setAdminProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [createAdminProfile, getAdminEmails]);

  // ✅ ENHANCED: Effect with proper cleanup and error boundary
  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
          setAdminProfile(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        await verifyAdminAccess(user as UserAuth);
      } catch (error) {
        logger.error('Erro no useEffect de admin', error, 'useAdminAuth');
        if (isMounted) {
          setIsAdmin(false);
          setAdminProfile(null);
          setIsLoading(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, verifyAdminAccess]);

  // ✅ UTILITY: Force refresh admin status
  const refreshAdminStatus = useCallback(async () => {
    if (user) {
      await verifyAdminAccess(user as UserAuth);
    }
  }, [user, verifyAdminAccess]);

  return {
    isAdmin,
    isLoading: authLoading || isLoading,
    adminProfile,
    error,
    refreshAdminStatus,
    user
  };
};
