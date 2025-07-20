import React from 'react';
import { CourseGrid } from './CourseGrid';

interface PlataformaSonhosProps {
  isEmbedded?: boolean;
  onBack?: () => void;
}

export const PlataformaSonhos: React.FC<PlataformaSonhosProps> = ({
  isEmbedded = false,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Conteúdo Principal */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <CourseGrid />
        </div>
      </main>
    </div>
  );
}; 