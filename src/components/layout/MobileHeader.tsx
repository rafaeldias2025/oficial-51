import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  User, 
  Calendar, 
  TrendingUp, 
  Menu, 
  Settings 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/admin';

interface MobileHeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onMenuToggle: () => void;
  userProfile?: UserProfile | null;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeSection,
  onSectionChange,
  onMenuToggle,
  userProfile
}) => {
  const { user } = useAuth();

  // ✅ SAFE: Function to get user initials with fallback
  const getUserInitials = (profile?: UserProfile | null, authUser?: any): string => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (authUser?.email) {
      return authUser.email.charAt(0).toUpperCase();
    }
    
    return 'U'; // Default fallback
  };

  // ✅ SAFE: Function to get display name with fallback
  const getDisplayName = (profile?: UserProfile | null, authUser?: any): string => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    
    if (authUser?.email) {
      // Extract name from email (before @)
      const emailName = authUser.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Usuário';
  };

  const navigationItems = [
    { 
      id: 'home', 
      label: 'Início', 
      icon: Home,
      description: 'Dashboard principal'
    },
    { 
      id: 'profile', 
      label: 'Perfil', 
      icon: User,
      description: 'Seus dados pessoais'
    },
    { 
      id: 'missions', 
      label: 'Missões', 
      icon: Calendar,
      description: 'Tarefas diárias'
    },
    { 
      id: 'progress', 
      label: 'Progresso', 
      icon: TrendingUp,
      description: 'Sua evolução'
    }
  ];

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Menu Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="p-2"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* App Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Instituto TV30
          </h1>
          <p className="text-xs text-gray-500">
            {navigationItems.find(item => item.id === activeSection)?.description || 'Dashboard'}
          </p>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={userProfile?.avatar_url || undefined}
              alt={getDisplayName(userProfile, user)}
            />
            <AvatarFallback className="text-xs bg-instituto-orange text-white">
              {getUserInitials(userProfile, user)}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 truncate max-w-24">
              {getDisplayName(userProfile, user)}
            </p>
            {userProfile?.role && (
              <p className="text-xs text-gray-500 capitalize">
                {userProfile.role === 'admin' ? 'Admin' : 'Usuário'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="mt-3 flex overflow-x-auto space-x-1 pb-2" role="navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs
                ${isActive 
                  ? 'bg-instituto-orange text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              aria-label={`Navegar para ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </header>
  );
};
