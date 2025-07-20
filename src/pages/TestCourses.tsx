import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/admin';

const TestCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cursos Disponíveis</h1>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded-lg">
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-gray-600">ID: {course.id}</p>
            <p className="text-sm text-gray-600">Categoria: {course.category}</p>
            <p className="text-sm text-gray-600">Preço: ${course.price}</p>
            <a 
              href={`/admin/courses/${course.id}/modules/1/edit`}
              className="text-blue-500 hover:underline"
            >
              Editar Módulos
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCourses; 