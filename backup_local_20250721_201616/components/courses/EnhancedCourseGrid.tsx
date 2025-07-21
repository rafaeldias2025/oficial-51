import React from 'react';
import { useCourses, Course } from '@/hooks/useCourses';

interface EnhancedCourseGridProps {
  onCourseSelect?: (courseId: string) => void;
}

export const EnhancedCourseGrid: React.FC<EnhancedCourseGridProps> = ({ onCourseSelect }) => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div>Carregando cursos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {course.image_url && (
            <img 
              src={course.image_url} 
              alt={course.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
            <div className="flex justify-between items-center">
              {course.is_premium && (
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  Premium
                </span>
              )}
              <button 
                onClick={() => onCourseSelect?.(course.id)}
                className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90"
              >
                Ver Curso
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 