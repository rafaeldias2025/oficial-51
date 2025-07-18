import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, Edit, Trash2, Upload, Eye, BookOpen, PlayCircle, FileText, Calendar, Settings, 
  Video, Image, Clock, Users, ChevronDown, ChevronRight, Monitor, 
  MoreVertical, Copy, Archive, Star, Download, Share, BarChart3,
  CheckCircle, AlertCircle, Globe, Lock, DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  is_active: boolean;
  category: string;
  created_at?: string;
  updated_at?: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  image_url?: string | null;
  order_index: number;
  is_active: boolean;
  course_id: string;
  lessons?: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  description: string | null;
  video_url?: string;
  duration_minutes: number | null;
  order_index: number;
  is_active: boolean;
  module_id: string;
}

export const EnhancedCourseManagement = () => {
  const { courses, loading, createCourse, updateCourse, deleteCourse, fetchCourseModules, createModule, createLesson } = useCourses();
  const { toast } = useToast();
  
  // Estados principais
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  
  // Estados para modais
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  
  // Estados para formulários
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
    price: 0,
    is_active: true
  });

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
    release_date: '',
    release_type: 'immediate', // immediate, scheduled, by_date
    content: '',
    attachments: []
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'tree'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers principais
  const handleCreateCourse = async () => {
    try {
      if (isEditMode && editingItem) {
        await updateCourse(editingItem.id, courseForm);
        toast({
          title: "Sucesso",
          description: "Curso atualizado com sucesso!",
        });
      } else {
        await createCourse(courseForm);
        toast({
          title: "Sucesso", 
          description: "Curso criado com sucesso!",
        });
      }
      
      setIsCourseModalOpen(false);
      resetForms();
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditMode ? "Erro ao atualizar curso" : "Erro ao criar curso",
        variant: "destructive",
      });
    }
  };

  const handleCreateModule = async () => {
    if (!selectedCourse) return;
    
    try {
      await createModule({
        course_id: selectedCourse.id,
        ...moduleForm
      });
      
      setIsModuleModalOpen(false);
      await refreshModules();
      resetForms();
      
      toast({
        title: "Sucesso",
        description: "Módulo criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar módulo",
        variant: "destructive",
      });
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedModule) return;
    
    try {
      await createLesson({
        module_id: selectedModule.id,
        ...lessonForm
      });
      
      setIsLessonModalOpen(false);
      await refreshModules();
      resetForms();
      
      toast({
        title: "Sucesso",
        description: "Aula criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar aula",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingItem(course);
    setCourseForm({
      title: course.title,
      description: course.description || '',
      image_url: course.image_url || '',
      category: course.category,
      price: course.price || 0,
      is_active: course.is_active
    });
    setIsEditMode(true);
    setIsCourseModalOpen(true);
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
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url,
      duration_minutes: lesson.duration_minutes || 0,
      order_index: lesson.order_index,
      is_active: lesson.is_active,
      release_date: '',
      release_type: 'immediate',
      content: '',
      attachments: []
    });
    setIsContentEditorOpen(true);
  };

  const handleViewCourse = async (course: Course) => {
    setSelectedCourse(course);
    await refreshModules(course.id);
  };

  const refreshModules = async (courseId?: string) => {
    const targetCourseId = courseId || selectedCourse?.id;
    if (targetCourseId) {
      const modules = await fetchCourseModules(targetCourseId);
      setCourseModules(modules);
    }
  };

  const resetForms = () => {
    setCourseForm({
      title: '',
      description: '',
      image_url: '',
      category: 'general',
      price: 0,
      is_active: true
    });
    setModuleForm({
      title: '',
      description: '',
      image_url: '',
      order_index: 0,
      is_active: true
    });
    setLessonForm({
      title: '',
      description: '',
      video_url: '',
      duration_minutes: 0,
      order_index: 0,
      is_active: true,
      release_date: '',
      release_type: 'immediate',
      content: '',
      attachments: []
    });
    setIsEditMode(false);
    setEditingItem(null);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pilulas': return 'bg-green-500';
      case 'plataforma': return 'bg-blue-500';
      case 'comunidade': return 'bg-purple-500';
      default: return 'bg-instituto-orange';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'pilulas': return 'Pílulas do Bem';
      case 'plataforma': return 'Plataforma dos Sonhos';
      case 'comunidade': return 'Comunidade dos Sonhos';
      default: return 'Geral';
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instituto-orange"></div>
      </div>
    );
  }

  // Editor de conteúdo da aula
  if (isContentEditorOpen && selectedLesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setIsContentEditorOpen(false)}>
              ← Voltar
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-netflix-text">Editar Conteúdo</h2>
              <p className="text-netflix-text-secondary">{selectedLesson.title}</p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Salvar alterações
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="video">Vídeo</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="attachments">Anexos</TabsTrigger>
            <TabsTrigger value="release">Liberação</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-netflix-text">
                  <FileText className="w-5 h-5" />
                  Detalhes do Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lesson-title">Título</Label>
                  <Input
                    id="lesson-title"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-description">Descrição</Label>
                  <Textarea
                    id="lesson-description"
                    placeholder="Escreva uma descrição do conteúdo..."
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-order">Ordem</Label>
                  <Input
                    id="lesson-order"
                    type="number"
                    value={lessonForm.order_index}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-netflix-text">
                  <Video className="w-5 h-5" />
                  Vídeo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video-url">URL do Vídeo</Label>
                  <Input
                    id="video-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={lessonForm.video_url}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, video_url: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={lessonForm.duration_minutes}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                    className="bg-netflix-hover border-netflix-border"
                  />
                </div>
                {lessonForm.video_url && (
                  <div className="mt-4">
                    <Label>Pré-visualização</Label>
                    <div className="mt-2 bg-netflix-hover rounded-lg p-4 border border-netflix-border">
                      <div className="aspect-video bg-black rounded flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-12 h-12 text-netflix-text-secondary mx-auto mb-2" />
                          <p className="text-netflix-text-secondary">Preview do vídeo aqui</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-netflix-text">
                  <FileText className="w-5 h-5" />
                  Editor de Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 bg-netflix-hover rounded-lg border border-netflix-border">
                    <Button variant="outline" size="sm">B</Button>
                    <Button variant="outline" size="sm">I</Button>
                    <Button variant="outline" size="sm">U</Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="outline" size="sm">🔗</Button>
                    <Button variant="outline" size="sm">📝</Button>
                    <Button variant="outline" size="sm">📊</Button>
                  </div>
                  <Textarea
                    placeholder="Escreva o conteúdo da aula aqui..."
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border min-h-[300px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-netflix-text">
                  <Upload className="w-5 h-5" />
                  Anexos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-netflix-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-netflix-text-secondary mx-auto mb-4" />
                  <p className="text-netflix-text mb-2">
                    Drag here or <span className="text-purple-400 underline cursor-pointer">selecione do computador</span>
                  </p>
                  <p className="text-sm text-netflix-text-secondary">
                    Você pode anexar arquivos até 10MB cada
                  </p>
                  <div className="mt-4">
                    <p className="text-xs text-netflix-text-secondary">
                      JPEG, JPG, PNG, WEBP até 2MB cada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="release" className="space-y-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-netflix-text">
                  <Calendar className="w-5 h-5" />
                  Quando liberar o conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tipo de liberação</Label>
                  <Select value={lessonForm.release_type} onValueChange={(value) => setLessonForm(prev => ({ ...prev, release_type: value }))}>
                    <SelectTrigger className="bg-netflix-hover border-netflix-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">🟢 Liberação imediata</SelectItem>
                      <SelectItem value="by_date">📅 Por data</SelectItem>
                      <SelectItem value="scheduled">⏰ Liberar em dias após a compra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {lessonForm.release_type === 'by_date' && (
                  <div>
                    <Label htmlFor="release-date">Liberar em</Label>
                    <Input
                      id="release-date"
                      type="datetime-local"
                      value={lessonForm.release_date}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, release_date: e.target.value }))}
                      className="bg-netflix-hover border-netflix-border"
                    />
                  </div>
                )}

                {lessonForm.release_type === 'scheduled' && (
                  <div>
                    <Label htmlFor="release-days">Liberar em</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="release-days"
                        type="number"
                        placeholder="0"
                        className="bg-netflix-hover border-netflix-border flex-1"
                      />
                      <span className="text-netflix-text-secondary">dias após a compra</span>
                    </div>
                  </div>
                )}

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      ⚠️
                    </div>
                    <div>
                      <p className="text-orange-400 font-medium">Tamanho recomendado: 640x360 pixels</p>
                      <p className="text-xs text-netflix-text-secondary mt-1">
                        Aprenda mais sobre as <span className="text-purple-400 underline cursor-pointer">configurações de liberação de conteúdos</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Duração do conteúdo</Label>
                  <Select defaultValue="unlimited">
                    <SelectTrigger className="bg-netflix-hover border-netflix-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">🔄 Limitar duração do conteúdo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Visualização detalhada do curso
  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              ← Voltar
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-netflix-text">{selectedCourse.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getCategoryColor(selectedCourse.category)} text-white`}>
                  {getCategoryLabel(selectedCourse.category)}
                </Badge>
                <span className="text-netflix-text-secondary">•</span>
                <span className="text-netflix-text-secondary">{courseModules.length} módulos</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload de vídeos
            </Button>
            <Button variant="outline" className="gap-2">
              <Monitor className="w-4 h-4" />
              Minimizar
            </Button>
            <Button onClick={() => setIsModuleModalOpen(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
              Adicionar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courseModules.map((module) => (
            <Card key={module.id} className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModuleExpansion(module.id)}
                      className="p-0 h-auto"
                    >
                      {expandedModules.has(module.id) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </Button>
                    <div className="w-8 h-8 bg-netflix-hover rounded flex items-center justify-center">
                      📝
                    </div>
                    <div>
                      <CardTitle className="text-netflix-text">{module.title}</CardTitle>
                      <p className="text-sm text-netflix-text-secondary">
                        ▼ {module.lessons?.length || 0} conteúdos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedModule(module);
                        setIsLessonModalOpen(true);
                      }}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-netflix-card border-netflix-border">
                        <DropdownMenuItem onClick={() => handleEditModule(module)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              {expandedModules.has(module.id) && (
                <CardContent>
                  <div className="space-y-3">
                    {module.lessons?.map((lesson: any, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-netflix-hover rounded-lg border border-netflix-border">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-netflix-background rounded flex items-center justify-center text-xs">
                            📝
                          </div>
                          <div>
                            <h4 className="font-medium text-netflix-text">{lesson.title}</h4>
                            {lesson.description && (
                              <p className="text-sm text-netflix-text-secondary">{lesson.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            🟢 Publicado
                          </Badge>
                          {lesson.duration_minutes && (
                            <div className="flex items-center gap-1 text-netflix-text-secondary">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{lesson.duration_minutes}min</span>
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-netflix-card border-netflix-border">
                              <DropdownMenuItem onClick={() => handleEditLesson(lesson)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )) || (
                      <p className="text-netflix-text-secondary text-center py-4">
                        Nenhuma aula adicionada ainda
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
          
          {courseModules.length === 0 && (
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-netflix-text-secondary mx-auto mb-4" />
                <p className="text-netflix-text-secondary">
                  Nenhum módulo criado ainda. Adicione o primeiro módulo para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal para criar/editar módulo */}
        <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
          <DialogContent className="bg-netflix-card border-netflix-border">
            <DialogHeader>
              <DialogTitle className="text-netflix-text">
                {isEditMode ? 'Editar Módulo' : 'Novo Módulo'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="module-title">Título da seção</Label>
                <Input
                  id="module-title"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="module-description">Descrição</Label>
                <Textarea
                  id="module-description"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="module-image">Imagem de capa</Label>
                <div className="flex gap-2">
                  <Input
                    id="module-image"
                    placeholder="URL da imagem ou faça upload"
                    value={moduleForm.image_url}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border flex-1"
                  />
                  <Button variant="outline" onClick={() => setIsImageUploadOpen(true)}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="module-order">Ordem</Label>
                <Input
                  id="module-order"
                  type="number"
                  value={moduleForm.order_index}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => { setIsModuleModalOpen(false); resetForms(); }}>
                  {isEditMode ? 'Excluir conteúdo' : 'Cancelar'}
                </Button>
                <Button onClick={handleCreateModule} className="bg-purple-600 hover:bg-purple-700">
                  {isEditMode ? 'Salvar alterações' : 'Criar Módulo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para criar aula */}
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent className="bg-netflix-card border-netflix-border">
            <DialogHeader>
              <DialogTitle className="text-netflix-text">Nova Aula</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lesson-title">Título</Label>
                <Input
                  id="lesson-title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="lesson-description">Descrição</Label>
                <Textarea
                  id="lesson-description"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="lesson-video">Vídeo</Label>
                <Input
                  id="lesson-video"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, video_url: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
                <p className="text-xs text-netflix-text-secondary mt-1">
                  💡 Remover vídeo
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => { setIsLessonModalOpen(false); resetForms(); }}>
                  Excluir conteúdo
                </Button>
                <Button onClick={handleCreateLesson} className="bg-purple-600 hover:bg-purple-700">
                  Salvar alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Visualização principal - grid de cursos
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-netflix-text">Cursos</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            Importar curso
          </Button>
          <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                Criar curso
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-netflix-hover border-netflix-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('grid')}
          >
            Grid
          </Button>
          <Button
            variant={activeView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('list')}
          >
            Lista
          </Button>
        </div>
      </div>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="bg-netflix-card border-netflix-border overflow-hidden group hover:border-instituto-orange transition-colors">
            <div className="relative">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-netflix-hover flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-netflix-text-secondary mx-auto mb-2" />
                    <p className="text-sm text-netflix-text-secondary">Sem imagem</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleViewCourse(course)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Pré-visualizar
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="secondary">
                        <Settings className="w-4 h-4 mr-1" />
                        Configurações
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-netflix-card border-netflix-border">
                      <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-netflix-text line-clamp-2">{course.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-netflix-card border-netflix-border">
                    <DropdownMenuItem onClick={() => handleViewCourse(course)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${getCategoryColor(course.category)} text-white text-xs`}>
                  {getCategoryLabel(course.category)}
                </Badge>
                {course.price > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    R$ {course.price}
                  </Badge>
                )}
              </div>

              {course.description && (
                <p className="text-sm text-netflix-text-secondary line-clamp-2 mb-3">
                  {course.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-netflix-text-secondary">
                <span>2 módulos</span>
                <div className="flex items-center gap-1">
                  {course.is_active ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                  )}
                  <span>{course.is_active ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-netflix-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-netflix-text mb-2">
              {searchTerm ? 'Nenhum curso encontrado' : 'Nenhum curso criado ainda'}
            </h3>
            <p className="text-netflix-text-secondary mb-4">
              {searchTerm 
                ? `Não encontramos cursos que correspondam a "${searchTerm}"`
                : 'Comece criando seu primeiro curso para organizar o conteúdo'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCourseModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar primeiro curso
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal para criar/editar curso */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-netflix-text">
              {isEditMode ? 'Editar Curso' : 'Criar Novo Curso'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="course-title">Título do Curso</Label>
                <Input
                  id="course-title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div>
                <Label htmlFor="course-description">Descrição</Label>
                <Textarea
                  id="course-description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-netflix-hover border-netflix-border min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="course-image">Imagem do Curso</Label>
                <div className="flex gap-2">
                  <Input
                    id="course-image"
                    placeholder="URL da imagem ou faça upload"
                    value={courseForm.image_url}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="bg-netflix-hover border-netflix-border flex-1"
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label htmlFor="course-category">Categoria</Label>
                <Select value={courseForm.category} onValueChange={(value) => setCourseForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-netflix-hover border-netflix-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pilulas">Pílulas do Bem</SelectItem>
                    <SelectItem value="plataforma">Plataforma dos Sonhos</SelectItem>
                    <SelectItem value="comunidade">Comunidade dos Sonhos</SelectItem>
                    <SelectItem value="general">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="course-price">Preço (R$)</Label>
                <Input
                  id="course-price"
                  type="number"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="bg-netflix-hover border-netflix-border"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="course-active">Curso ativo</Label>
                <Switch
                  id="course-active"
                  checked={courseForm.is_active}
                  onCheckedChange={(checked) => setCourseForm(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-netflix-text-secondary mx-auto mb-4" />
                <p className="text-netflix-text-secondary">
                  Configurações avançadas em breve...
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={() => { setIsCourseModalOpen(false); resetForms(); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCourse} className="bg-purple-600 hover:bg-purple-700">
              {isEditMode ? 'Salvar alterações' : 'Criar Curso'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};