import React from 'react';
import { Course } from '@/hooks/useCourses';

interface CourseHeroSectionProps {
  course?: Course;
  isAdmin?: boolean;
  onEditCoverVideo?: () => void;
  onStartCourse?: () => void;
  onResumeCourse?: () => void;
}

export const CourseHeroSection: React.FC<CourseHeroSectionProps> = ({ 
  course,
  isAdmin = false,
  onEditCoverVideo,
  onStartCourse,
  onResumeCourse
}) => {
  const title = course?.title || "Cursos Premium";
  const description = course?.description || "Descubra nossos cursos exclusivos";

  return (
    <div className="bg-gradient-to-r from-primary to-accent text-white p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg opacity-90 mb-6">{description}</p>
      
      <div className="flex gap-4">
        {isAdmin && onEditCoverVideo && (
          <button 
            onClick={onEditCoverVideo}
            className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30"
          >
            Editar Capa
          </button>
        )}
        
        {onStartCourse && (
          <button 
            onClick={onStartCourse}
            className="bg-white text-primary px-6 py-3 rounded font-semibold hover:bg-gray-100"
          >
            Iniciar Curso
          </button>
        )}
        
        {onResumeCourse && (
          <button 
            onClick={onResumeCourse}
            className="bg-white text-primary px-6 py-3 rounded font-semibold hover:bg-gray-100"
          >
            Continuar Curso
          </button>
        )}
      </div>
    </div>
  );
}; 