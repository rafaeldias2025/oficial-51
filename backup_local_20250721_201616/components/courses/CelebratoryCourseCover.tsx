import React from 'react';
import { cn } from '@/lib/utils';

interface CelebratoryCourseCoverProps {
  title: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CelebratoryCourseCover: React.FC<CelebratoryCourseCoverProps> = ({
  title,
  category = 'Curso',
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-48 h-32',
    md: 'w-64 h-40',
    lg: 'w-80 h-52'
  };

  const titleSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const categorySize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg",
      sizeClasses[size],
      className
    )}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600" />
      
      {/* Confetti Elements */}
      <div className="absolute inset-0">
        {/* Confetti pieces */}
        <div className="absolute top-2 left-4 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="absolute top-6 right-6 w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-12 left-8 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-8 right-12 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-16 left-16 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }} />
        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1.1s' }} />
        
        {/* Streamers */}
        <div className="absolute top-0 left-1/4 w-1 h-8 bg-orange-400 transform -rotate-12 animate-pulse" />
        <div className="absolute top-2 right-1/3 w-1 h-6 bg-teal-400 transform rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-4 left-1/2 w-1 h-10 bg-yellow-400 transform -rotate-6 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-4">
        {/* Category Badge */}
        <div className={cn(
          "bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2",
          categorySize[size]
        )}>
          {category}
        </div>

        {/* Title */}
        <h3 className={cn(
          "font-bold leading-tight text-center",
          titleSize[size]
        )}>
          {title}
        </h3>

        {/* Celebration Icon */}
        <div className="mt-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      </div>

      {/* Bottom Cake Element */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-12 h-8 bg-teal-400 rounded-lg relative">
          {/* Cake layers */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-teal-500 rounded-t-lg" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-teal-600 rounded-t-lg" />
          
          {/* Candles */}
          <div className="absolute top-0 left-1/4 w-1 h-3 bg-orange-400 rounded-full" />
          <div className="absolute top-0 left-1/2 w-1 h-3 bg-orange-400 rounded-full" />
          <div className="absolute top-0 right-1/4 w-1 h-3 bg-orange-400 rounded-full" />
          
          {/* Sprinkles */}
          <div className="absolute top-1 left-2 w-1 h-1 bg-yellow-400 rounded-full" />
          <div className="absolute top-2 right-2 w-1 h-1 bg-red-400 rounded-full" />
          <div className="absolute top-1 left-1/2 w-1 h-1 bg-orange-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}; 