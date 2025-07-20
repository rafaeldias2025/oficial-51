import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NetflixButton, 
  NetflixPrimaryButton, 
  NetflixSecondaryButton,
  NetflixBackButton,
  NetflixNextButton,
  NetflixSaveButton,
  NetflixDeleteButton,
  NetflixPlayButton
} from './netflix-buttons';

// ===== FLUXOS DE NAVEGAÇÃO NETFLIX =====

export const NetflixNavigationFlow: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 p-4 netflix-card">
      <NetflixButton onClick={() => navigate('/')}>
        Início
      </NetflixButton>
      <NetflixButton onClick={() => navigate('/dashboard')} variant="secondary">
        Dashboard
      </NetflixButton>
      <NetflixButton onClick={() => navigate('/courses')} variant="outline">
        Cursos
      </NetflixButton>
      <NetflixButton onClick={() => navigate('/assessment')} variant="ghost">
        Avaliação
      </NetflixButton>
    </div>
  );
};

// ===== FLUXO DE AVALIAÇÃO NETFLIX =====

interface AssessmentFlowProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  isLastStep?: boolean;
}

export const NetflixAssessmentFlow: React.FC<AssessmentFlowProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onComplete,
  isLastStep = false
}) => {
  return (
    <div className="flex justify-between items-center p-6 netflix-card">
      <div className="flex items-center gap-4">
        <span className="text-netflix-text-muted">
          Passo {currentStep} de {totalSteps}
        </span>
        <div className="w-32 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-netflix-red h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        {currentStep > 1 && (
          <NetflixBackButton onClick={onBack} />
        )}
        
        {isLastStep ? (
          <NetflixButton onClick={onComplete} size="lg">
            Finalizar Avaliação
          </NetflixButton>
        ) : (
          <NetflixNextButton onClick={onNext} />
        )}
      </div>
    </div>
  );
};

// ===== FLUXO DE REPRODUÇÃO DE SESSÃO NETFLIX =====

interface SessionPlayerFlowProps {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onBack: () => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export const NetflixSessionPlayerFlow: React.FC<SessionPlayerFlowProps> = ({
  onPlay,
  onPause,
  onStop,
  onBack,
  isPlaying,
  currentTime,
  duration
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 netflix-card">
      <div className="flex items-center justify-between mb-4">
        <NetflixBackButton onClick={onBack} />
        <div className="text-netflix-text">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-netflix-red h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <NetflixButton 
          onClick={isPlaying ? onPause : onPlay}
          size="lg"
        >
          {isPlaying ? 'Pausar' : 'Reproduzir'}
        </NetflixButton>
        
        <NetflixButton 
          onClick={onStop}
          variant="secondary"
        >
          Parar
        </NetflixButton>
      </div>
    </div>
  );
};

// ===== FLUXO DE CRIAÇÃO/EDIÇÃO NETFLIX =====

interface CreateEditFlowProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  isSaving?: boolean;
}

export const NetflixCreateEditFlow: React.FC<CreateEditFlowProps> = ({
  onSave,
  onCancel,
  onDelete,
  isEditing = false,
  isSaving = false
}) => {
  return (
    <div className="flex gap-4 p-6 netflix-card">
      <NetflixSaveButton 
        onClick={onSave}
        disabled={isSaving}
      />
      
      <NetflixButton 
        onClick={onCancel}
        variant="outline"
      >
        Cancelar
      </NetflixButton>
      
      {isEditing && onDelete && (
        <NetflixDeleteButton onClick={onDelete} />
      )}
    </div>
  );
};

// ===== FLUXO DE CONFIRMAÇÃO NETFLIX =====

interface ConfirmationFlowProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const NetflixConfirmationFlow: React.FC<ConfirmationFlowProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info'
}) => {
  const variantClasses = {
    danger: 'border-red-500 bg-red-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    info: 'border-blue-500 bg-blue-500/10'
  };

  const buttonVariant = variant === 'danger' ? 'destructive' : 'primary';

  return (
    <div className={`p-6 netflix-card border ${variantClasses[variant]}`}>
      <h3 className="text-xl font-bold text-netflix-text mb-2">
        {title}
      </h3>
      <p className="text-netflix-text-muted mb-6">
        {message}
      </p>
      
      <div className="flex gap-4">
        <NetflixButton 
          onClick={onConfirm}
          variant={buttonVariant}
        >
          {confirmText}
        </NetflixButton>
        
        <NetflixButton 
          onClick={onCancel}
          variant="outline"
        >
          {cancelText}
        </NetflixButton>
      </div>
    </div>
  );
};

// ===== FLUXO DE CARREGAMENTO NETFLIX =====

interface LoadingFlowProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const NetflixLoadingFlow: React.FC<LoadingFlowProps> = ({
  message = 'Carregando...',
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 netflix-card">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mb-4" />
      
      <p className="text-netflix-text text-lg mb-4">
        {message}
      </p>
      
      {showProgress && (
        <div className="w-full max-w-md">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-netflix-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-netflix-text-muted text-sm mt-2 text-center">
            {progress}% concluído
          </p>
        </div>
      )}
    </div>
  );
};

// ===== FLUXO DE ERRO NETFLIX =====

interface ErrorFlowProps {
  title: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const NetflixErrorFlow: React.FC<ErrorFlowProps> = ({
  title,
  message,
  onRetry,
  onBack
}) => {
  return (
    <div className="p-6 netflix-card border border-red-500 bg-red-500/10">
      <div className="flex items-center mb-4">
        <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-netflix-text">
          {title}
        </h3>
      </div>
      
      <p className="text-netflix-text-muted mb-6">
        {message}
      </p>
      
      <div className="flex gap-4">
        {onRetry && (
          <NetflixButton onClick={onRetry}>
            Tentar Novamente
          </NetflixButton>
        )}
        
        {onBack && (
          <NetflixButton onClick={onBack} variant="outline">
            Voltar
          </NetflixButton>
        )}
      </div>
    </div>
  );
}; 