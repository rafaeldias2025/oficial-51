import React from 'react';
import { useCourses } from '@/hooks/useCourses';

export const PaidCourses: React.FC = () => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div>Carregando cursos...</div>;
  if (error) return <div>Erro: {error}</div>;

  const premiumCourses = courses.filter(course => course.is_premium);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {premiumCourses.map(course => (
        <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex justify-between items-center">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
              Premium
            </span>
            <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90">
              Ver Curso
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 