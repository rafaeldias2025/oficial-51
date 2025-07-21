import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleEditor } from '@/components/admin/ModuleEditor';
import { Course } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ModuleEditPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
        toast.error('Erro ao carregar curso');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleBack = () => {
    navigate('/admin/courses');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <p className="text-muted-foreground mb-4">
            O curso solicitado não foi encontrado.
          </p>
          <button 
            onClick={() => navigate('/admin')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Voltar ao Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ModuleEditor course={course} onBack={handleBack} />
    </div>
  );
};

export default ModuleEditPage; 