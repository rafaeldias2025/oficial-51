import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AdvancedLessonManager } from '@/components/admin/AdvancedLessonManager';
import { CourseModule } from '@/types/admin';

const LessonCreatePage: React.FC = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const { data, error } = await supabase
          .from('course_modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (error) throw error;
        setModule(data);
      } catch (error) {
        console.error('Erro ao buscar módulo:', error);
        toast.error('Erro ao carregar informações do módulo');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  const handleLessonAdded = () => {
    toast.success('Aula criada com sucesso!');
    navigate(`/admin/courses/${courseId}/modules/${moduleId}/edit`);
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

  if (!module) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Módulo não encontrado</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/courses/${courseId}/modules/${moduleId}/edit`)}
            className="mt-4"
          >
            ← Voltar para o Módulo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/admin/courses/${courseId}/modules/${moduleId}/edit`)}
          className="mb-4"
        >
          ← Voltar para o Módulo
        </Button>
        
        <h1 className="text-3xl font-bold">Nova Aula Avançada</h1>
        <p className="text-muted-foreground">
          Módulo: {module.title}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciador Avançado de Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedLessonManager
            moduleId={moduleId!}
            module={module}
            onLessonAdded={handleLessonAdded}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonCreatePage; 