
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { setupAdminTables, insertSampleData } from '@/utils/setupAdminTables';
import { AdminSetupInstructions } from './AdminSetupInstructions';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

interface UserProfile {
  id?: string;
  user_id?: string;
  role?: string;
  admin_level?: number;
  email?: string;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [tablesReady, setTablesReady] = useState<boolean | null>(null);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lista de emails administrativos
  const adminEmails = [
    'admin@instituto.com',
    'admin@sonhos.com',
    'admin@example.com',
    'rafael@admin.com',
    'rafael@institutodossonhos.com',
    'institutodossonhos@gmail.com',
    'admin@test.com'
  ];

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // Primeira verificação: o email está na lista?
    const emailIsInList = adminEmails.includes(user.email || '');

    // Segunda verificação: verificar role no perfil
    const checkAdminRole = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, admin_level')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('🔒 Erro ao buscar perfil:', error);
          setIsAdmin(emailIsInList); // Fallback para a verificação de email
          setIsLoading(false);
          return;
        }

        // Verificar se tem role de admin ou admin_level >= 100
        const profileData = profile as UserProfile;
        const hasAdminRole = profileData?.role === 'admin';
        const hasAdminLevel = profileData?.admin_level && profileData.admin_level >= 100;

        // É admin se estiver na lista de emails OU tiver role/level de admin
        const isUserAdmin = emailIsInList || hasAdminRole || hasAdminLevel;
        
        console.log('🔒 AdminProtectedRoute - Admin check:', {
          emailInList: emailIsInList,
          hasAdminRole,
          hasAdminLevel,
          isAdmin: isUserAdmin
        });

        setIsAdmin(isUserAdmin);
        setIsLoading(false);
      } catch (error) {
        console.error('🔒 Erro ao verificar perfil admin:', error);
        setIsAdmin(emailIsInList); // Fallback para a verificação de email
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [user, adminEmails]);

  console.log('🔒 AdminProtectedRoute - User:', user?.email, 'isAdmin:', isAdmin, 'isLoading:', isLoading);

  // Mostrar loading enquanto verifica
  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <Card className="bg-netflix-darkGray border-netflix-border">
          <CardContent className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mb-4"></div>
            <p className="text-netflix-white">Verificando permissões de administrador...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 AdminProtectedRoute - No user found');
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <Card className="bg-netflix-darkGray border-netflix-border w-96">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <AlertTriangle className="h-16 w-16 text-netflix-error mb-4" />
            <h2 className="text-xl font-bold text-netflix-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-netflix-lightGray">
              Você precisa estar logado para acessar o painel administrativo.
            </p>

            <Button 
              variant="netflix" 
              className="mt-6"
              onClick={() => window.location.href = '/auth'}
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('🔒 AdminProtectedRoute - Access denied. Not admin.');
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <Card className="bg-netflix-darkGray border-netflix-border w-96">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <AlertTriangle className="h-16 w-16 text-netflix-error mb-4" />
            <h2 className="text-xl font-bold text-netflix-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-netflix-lightGray mb-4">
              Você não tem permissão para acessar o painel administrativo.
            </p>
            <div className="bg-netflix-black p-4 rounded-lg text-left text-sm">
              <p className="text-netflix-lightGray mb-2">
                <strong>Seu email:</strong> {user.email}
              </p>
              <p className="text-netflix-lightGray mb-2">
                <strong>Emails admin permitidos:</strong>
              </p>
              <ul className="text-xs text-netflix-lightGray list-disc list-inside">
                {adminEmails.map(email => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-xs text-netflix-lightGray">
              <p>💡 Para ter acesso admin:</p>
              <p>1. Faça login com um dos emails acima, ou</p>
              <p>2. Peça para um admin adicionar seu email à lista</p>
              <p>3. Ou peça para definir sua role como 'admin' na tabela profiles</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Acesso permitido
  console.log('🔒 AdminProtectedRoute - ✅ ACESSO LIBERADO para:', user.email);
  
  // Verificar e configurar tabelas necessárias
  useEffect(() => {
    const initializeAdminSystem = async () => {
      console.log('🚀 Inicializando sistema administrativo...');
      
      // Verificar tabelas
      const result = await setupAdminTables();
      
      if (result === true) {
        // Inserir dados de exemplo se necessário
        await insertSampleData();
        console.log('✅ Sistema administrativo pronto!');
        setTablesReady(true);
      } else {
        console.log('⚠️ Algumas tabelas estão faltando.');
        setTablesReady(false);
        // Definir quais tabelas podem estar faltando
        const potentialMissingTables = ['goals', 'sessions', 'dados_saude_usuario', 'courses', 'course_modules', 'course_lessons'];
        setMissingTables(potentialMissingTables);
      }
    };

    if (isAdmin) {
      initializeAdminSystem();
    }
  }, [isAdmin]);

  const handleRefreshTables = async () => {
    setTablesReady(null); // Loading state
    
    const result = await setupAdminTables();
    
    if (result === true) {
      await insertSampleData();
      setTablesReady(true);
      setMissingTables([]);
    } else {
      setTablesReady(false);
    }
  };
  
  // Mostrar loading enquanto verifica tabelas
  if (tablesReady === null) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <Card className="bg-netflix-darkGray border-netflix-border w-96">
          <CardContent className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mb-4"></div>
            <p className="text-netflix-white">Verificando sistema administrativo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar instruções se tabelas estão faltando
  if (tablesReady === false) {
    return (
      <AdminSetupInstructions 
        missingTables={missingTables}
        onRefresh={handleRefreshTables}
      />
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-netflix-success text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">ACESSO LIBERADO</span>
        </div>
      </div>
      {children}
    </div>
  );
};
