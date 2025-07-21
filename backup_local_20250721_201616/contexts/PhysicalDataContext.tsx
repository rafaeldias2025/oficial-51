import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePhysicalDataComplete } from '@/hooks/usePhysicalDataComplete';
import { supabase } from '@/integrations/supabase/client';
import { PhysicalData, UserProfile } from '@/types/admin';

interface PhysicalDataContextType {
  isPhysicalDataComplete: boolean | null;
  isLoading: boolean;
  markAsComplete: () => void;
  showCadastroCompleto: boolean;
  setShowCadastroCompleto: (show: boolean) => void;
  physicalData: PhysicalData | null;
  refreshPhysicalData: () => Promise<void>;
}

const PhysicalDataContext = createContext<PhysicalDataContextType | undefined>(undefined);

export const PhysicalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isComplete, isLoading, markAsComplete } = usePhysicalDataComplete();
  const [showCadastroCompleto, setShowCadastroCompleto] = useState(false);
  const [physicalData, setPhysicalData] = useState<PhysicalData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const subscriptionRef = useRef<any>(null);

  // ✅ PERFORMANCE: Memoized function to fetch user profile
  const fetchUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, role, full_name, avatar_url, created_at, updated_at')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
          console.error('Erro ao buscar perfil:', error);
        }
        return null;
      }
      
      setUserProfile(data);
      return data;
    } catch (err: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao buscar perfil:', err);
      }
      return null;
    }
  }, [user?.id]);

  // ✅ PERFORMANCE: Memoized function to fetch physical data
  const fetchPhysicalData = useCallback(async (): Promise<void> => {
    if (!userProfile?.id) {
      setPhysicalData(null);
      return;
    }

    try {
      setDataLoading(true);
      
      // Buscar dados físicos mais recentes
      const { data, error } = await supabase
        .from('dados_fisicos_usuario')
        .select(`
          id,
          user_id,
          altura_cm,
          peso_atual_kg,
          circunferencia_abdominal_cm,
          imc,
          meta_peso_kg,
          updated_at
        `)
        .eq('user_id', userProfile.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) {
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
          console.error('Erro ao buscar dados físicos:', error);
        }
      } else {
        setPhysicalData(data);
      }
    } catch (err: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao buscar dados físicos:', err);
      }
    } finally {
      setDataLoading(false);
    }
  }, [userProfile?.id]);

  // ✅ EFFECT: Load user profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user, fetchUserProfile]);

  // ✅ EFFECT: Load physical data when profile is available
  useEffect(() => {
    if (userProfile) {
      fetchPhysicalData();
    }
  }, [userProfile, fetchPhysicalData]);

  // ✅ EFFECT: Control form display based on physical data completion
  useEffect(() => {
    if (user && !isLoading && isComplete !== null) {
      setShowCadastroCompleto(!isComplete);
    }
  }, [user, isComplete, isLoading]);

  // ✅ PERFORMANCE: Optimized subscription setup with cleanup
  useEffect(() => {
    if (!userProfile?.id) return;
    
    // Clean up existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    
    // Setup new subscription
    const channel = supabase
      .channel('physical-data-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'dados_fisicos_usuario',
          filter: `user_id=eq.${userProfile.id}`
        },
        (payload) => {
          if (import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.log('Dados físicos atualizados via subscription:', payload);
          }
          fetchPhysicalData();
        }
      )
      .subscribe();
    
    subscriptionRef.current = channel;
    
    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [userProfile?.id, fetchPhysicalData]);

  // ✅ ENHANCED: Mark as complete with callback
  const handleMarkAsComplete = useCallback(() => {
    markAsComplete();
    setShowCadastroCompleto(false);
  }, [markAsComplete]);

  return (
    <PhysicalDataContext.Provider value={{
      isPhysicalDataComplete: isComplete,
      isLoading: isLoading || dataLoading,
      markAsComplete: handleMarkAsComplete,
      showCadastroCompleto,
      setShowCadastroCompleto,
      physicalData,
      refreshPhysicalData: fetchPhysicalData
    }}>
      {children}
    </PhysicalDataContext.Provider>
  );
};

export const usePhysicalDataContext = () => {
  const context = useContext(PhysicalDataContext);
  if (context === undefined) {
    throw new Error('usePhysicalDataContext must be used within a PhysicalDataProvider');
  }
  return context;
};