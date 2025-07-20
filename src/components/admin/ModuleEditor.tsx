import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Edit, Trash2, ArrowLeft, Play, Clock, Eye, ChevronDown, 
  ChevronRight, Image as ImageIcon, Upload, Copy, Settings, BookOpen, FileText
} from 'lucide-react';
import { CourseModule, CourseLesson, Course } from '@/types/admin';
import { useModuleManagement } from '@/hooks/useModuleManagement';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';

interface ModuleEditorProps {
  course: Course;
  onBack: () => void;
}

export const ModuleEditor: React.FC<ModuleEditorProps> = ({ course, onBack }) => {
  const { fetchCourseModules, createModule, createLesson } = useCourses();
  const { updateModule, updateLesson, deleteModule, deleteLesson, duplicateModule } = useModuleManagement();
  const { toast } = useToast();

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Estados para modais e formulários
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    image_url: '',
    order_index: 0,
    is_active: true
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    order_index: 0,
    is_active: true,
    document_url: '',
    image_url: ''
  });

  useEffect(() => {
    loadModules();
  }, [course.id]);

  const loadModules = async () => {
    try {
      setLoading(true);
      const moduleData = await fetchCourseModules(course.id);
      setModules(moduleData);
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setModuleForm({
      title: '',
      description: '',
      image_url: '',
      order_index: modules.length + 1,
      is_active: true
    });
    setLessonForm({
      title: '',
      description: '',
      video_url: '',
      duration_minutes: 0,
      order_index: 0,
      is_active: true,
      document_url: '',
      image_url: ''
    });
    setIsEditMode(false);
    setEditingItem(null);
  };

  const handleCreateModule = async () => {
    try {
      if (isEditMode && editingItem) {
        await updateModule(editingItem.id, moduleForm);
      } else {
        await createModule({
          course_id: course.id,
          ...moduleForm,
          order_index: modules.length + 1
        });
      }
      
      setIsModuleModalOpen(false);
      resetForms();
      await loadModules();
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedModule) return;

    try {
      const moduleId = selectedModule.id;
      const existingLessons = selectedModule.lessons || [];
      
      if (isEditMode && editingItem) {
        await updateLesson(editingItem.id, lessonForm);
      } else {
        await createLesson({
          module_id: moduleId,
          ...lessonForm,
          order_index: existingLessons.length + 1
        });
      }
      
      setIsLessonModalOpen(false);
      resetForms();
      await loadModules();
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
    }
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingItem(module);
    setModuleForm({
      title: module.title,
      description: module.description || '',
      image_url: module.image_url || '',
      order_index: module.order_index,
      is_active: module.is_active
    });
    setIsEditMode(true);
    setIsModuleModalOpen(true);
  };

  const handleEditLesson = (lesson: CourseLesson) => {
    setEditingItem(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      duration_minutes: lesson.duration_minutes || 0,
      order_index: lesson.order_index,
      is_active: lesson.is_active,
      document_url: lesson.document_url || '',
      image_url: lesson.image_url || ''
    });
    setIsEditMode(true);
    setIsLessonModalOpen(true);
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-netflix-text">{course.title}</h2>
            <p className="text-netflix-text-secondary">Gerenciar Módulos e Aulas</p>
          </div>
        </div>
        <Button onClick={() => {
          resetForms();
          setIsModuleModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Módulo
        </Button>
      </div>

      {/* Lista de Módulos */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <Card key={module.id} className="bg-netflix-gray border-netflix-gray-light">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModuleExpansion(module.id)}
                  >
                    {expandedModules.has(module.id) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    {module.image_url && (
                      <img 
                        src={module.image_url} 
                        alt={module.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-netflix-text">
                        Módulo {moduleIndex + 1}: {module.title}
                      </CardTitle>
                      <p className="text-netflix-text-secondary text-sm">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={module.is_active ? "default" : "secondary"}>
                    {module.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = `/admin/courses/${course.id}/modules/${module.id}/lessons/new`;
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Aula Avançada
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditModule(module)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateModule(module).then(() => loadModules())}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteModule(module.id).then(() => loadModules())}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedModules.has(module.id) && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {module.lessons && module.lessons.length > 0 ? (
                    module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-netflix-surface rounded-lg">
                        <div className="flex items-center gap-3">
                          <Play className="w-4 h-4 text-instituto-orange" />
                          <div>
                            <h4 className="text-netflix-text font-medium">
                              Aula {lessonIndex + 1}: {lesson.title}
                            </h4>
                            <p className="text-netflix-text-secondary text-sm">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-netflix-text-secondary mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(lesson.duration_minutes || 0)}
                              </span>
                              <Badge variant={lesson.is_active ? "default" : "secondary"} className="text-xs">
                                {lesson.is_active ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLesson(lesson)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLesson(lesson.id).then(() => loadModules())}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-netflix-text-secondary">
                      <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma aula neste módulo</p>
                      <Button
                        variant="outline"
                        className="mt-3"
                        onClick={() => {
                          window.location.href = `/admin/courses/${course.id}/modules/${module.id}/lessons/new`;
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeira Aula Avançada
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {modules.length === 0 && (
          <Card className="bg-netflix-gray border-netflix-gray-light">
            <CardContent className="text-center py-12">
              <div className="text-netflix-text-secondary">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum módulo encontrado</h3>
                <p className="mb-4">Comece criando o primeiro módulo para este curso</p>
                <Button onClick={() => {
                  resetForms();
                  setIsModuleModalOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Módulo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal para Módulo */}
      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent className="bg-netflix-black border-netflix-gray-light">
          <DialogHeader>
            <DialogTitle className="text-netflix-text">
              {isEditMode ? 'Editar Módulo' : 'Novo Módulo'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="module-title" className="text-netflix-text">Título</Label>
              <Input
                id="module-title"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                className="bg-netflix-surface border-netflix-gray-light text-netflix-text"
                placeholder="Ex: Fundamentos básicos"
              />
            </div>

            <div>
              <Label htmlFor="module-description" className="text-netflix-text">Descrição</Label>
              <Textarea
                id="module-description"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                className="bg-netflix-surface border-netflix-gray-light text-netflix-text"
                placeholder="Descreva o que será abordado neste módulo"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="module-image" className="text-netflix-text">URL da Imagem</Label>
              <Input
                id="module-image"
                value={moduleForm.image_url}
                onChange={(e) => setModuleForm({ ...moduleForm, image_url: e.target.value })}
                className="bg-netflix-surface border-netflix-gray-light text-netflix-text"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="module-active"
                checked={moduleForm.is_active}
                onCheckedChange={(checked) => setModuleForm({ ...moduleForm, is_active: checked })}
              />
              <Label htmlFor="module-active" className="text-netflix-text">Módulo ativo</Label>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModuleModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateModule}>
                {isEditMode ? 'Atualizar' : 'Criar'} Módulo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
};