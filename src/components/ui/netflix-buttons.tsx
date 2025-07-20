import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ===== BOTÕES NETFLIX PADRÃO =====

interface NetflixButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

export const NetflixButton: React.FC<NetflixButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  size = 'md',
  variant = 'primary'
}) => {
  const baseClasses = "font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variantClasses = {
    primary: "bg-netflix-red hover:bg-netflix-red/90 text-white focus:ring-netflix-red/50 shadow-lg hover:shadow-xl active:scale-95",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-600/50 shadow-lg hover:shadow-xl active:scale-95",
    outline: "border-2 border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white focus:ring-netflix-red/50 shadow-lg hover:shadow-xl active:scale-95",
    ghost: "text-white hover:bg-white/10 focus:ring-white/50",
    destructive: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 shadow-lg hover:shadow-xl active:scale-95"
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Button>
  );
};

// ===== BOTÕES ESPECÍFICOS NETFLIX =====

export const NetflixPrimaryButton: React.FC<Omit<NetflixButtonProps, 'variant'>> = (props) => (
  <NetflixButton {...props} variant="primary" />
);

export const NetflixSecondaryButton: React.FC<Omit<NetflixButtonProps, 'variant'>> = (props) => (
  <NetflixButton {...props} variant="secondary" />
);

export const NetflixOutlineButton: React.FC<Omit<NetflixButtonProps, 'variant'>> = (props) => (
  <NetflixButton {...props} variant="outline" />
);

export const NetflixGhostButton: React.FC<Omit<NetflixButtonProps, 'variant'>> = (props) => (
  <NetflixButton {...props} variant="ghost" />
);

export const NetflixDestructiveButton: React.FC<Omit<NetflixButtonProps, 'variant'>> = (props) => (
  <NetflixButton {...props} variant="destructive" />
);

// ===== BOTÕES DE AÇÃO ESPECÍFICOS =====

export const NetflixPlayButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="primary" size="lg">
    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
    Assistir
  </NetflixButton>
);

export const NetflixBackButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="ghost" size="sm">
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Voltar
  </NetflixButton>
);

export const NetflixNextButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="primary">
    Próximo
    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </NetflixButton>
);

export const NetflixSaveButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="primary">
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
    Salvar
  </NetflixButton>
);

export const NetflixDeleteButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="destructive" size="sm">
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    Excluir
  </NetflixButton>
);

// ===== BOTÕES DE NAVEGAÇÃO =====

export const NetflixHomeButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="ghost" size="sm">
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
    Início
  </NetflixButton>
);

export const NetflixDashboardButton: React.FC<Omit<NetflixButtonProps, 'variant' | 'children'>> = (props) => (
  <NetflixButton {...props} variant="ghost" size="sm">
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    Dashboard
  </NetflixButton>
);

// ===== BOTÕES DE AÇÃO RÁPIDA =====

export const NetflixQuickActionButton: React.FC<NetflixButtonProps & { icon?: React.ReactNode }> = ({
  icon,
  children,
  ...props
}) => (
  <NetflixButton {...props} variant="outline" size="sm">
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </NetflixButton>
);

// ===== BOTÕES DE STATUS =====

export const NetflixStatusButton: React.FC<NetflixButtonProps & { status: 'success' | 'warning' | 'error' | 'info' }> = ({
  status,
  children,
  ...props
}) => {
  const statusClasses = {
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500/50",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500/50",
    error: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50",
    info: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50"
  };

  return (
    <NetflixButton {...props} className={statusClasses[status]}>
      {children}
    </NetflixButton>
  );
}; 