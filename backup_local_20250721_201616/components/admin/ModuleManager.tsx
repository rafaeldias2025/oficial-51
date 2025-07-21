import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  isActive: boolean;
  lessonCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ModuleFormData {
  title: string;
  description: string;
  courseId: string;
  order: number;
  isActive: boolean;
}

interface Course {
  id: string;
  title: string;
}

export const ModuleManager: React.FC = () => {
  // Dados mockados para demonstração
  const [courses] = useState<Course[]>([
    { id: '1', title: '7 CHAVES' },
    { id: '2', title: '12 CHÁS' },
    { id: '3', title: 'PÍLULAS DO BEM' },
    { id: '4', title: 'Jejum Intermitente' },
    { id: '5', title: 'Dia a Dia' },
    { id: '6', title: 'Doces dos Sonhos' },
    { id: '7', title: 'Exercícios dos Sonhos' }
  ]);

  const [modules, setModules] = useState<Module[]>([
    // 7 CHAVES
    {
      id: '1',
      title: 'Módulo 1: Fundamentos',
      description: 'Fundamentos básicos das 7 chaves para o sucesso',
      courseId: '1',
      order: 1,
      isActive: true,
      lessonCount: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // 12 CHÁS
    {
      id: '2',
      title: 'Chás Básicos',
      description: 'Aprenda a preparar chás básicos para saúde',
      courseId: '2',
      order: 1,
      isActive: true,
      lessonCount: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // PÍLULAS DO BEM
    {
      id: '3',
      title: 'Suplementos Essenciais',
      description: 'Suplementos essenciais para saúde e bem-estar',
      courseId: '3',
      order: 1,
      isActive: true,
      lessonCount: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Jejum Intermitente
    {
      id: '4',
      title: 'Fundamentos do Jejum',
      description: 'Aprenda os fundamentos do jejum intermitente',
      courseId: '4',
      order: 1,
      isActive: true,
      lessonCount: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Dia a Dia
    {
      id: '5',
      title: 'Rotinas Diárias',
      description: 'Rotinas diárias para uma vida mais saudável',
      courseId: '5',
      order: 1,
      isActive: true,
      lessonCount: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Doces dos Sonhos
    {
      id: '6',
      title: 'Doces Básicos',
      description: 'Receitas básicas de doces saudáveis',
      courseId: '6',
      order: 1,
      isActive: true,
      lessonCount: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      title: 'Doces Avançados',
      description: 'Receitas avançadas de doces gourmet',
      courseId: '6',
      order: 2,
      isActive: true,
      lessonCount: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8',
      title: 'Receitas para Diabéticos',
      description: 'Doces especiais para diabéticos',
      courseId: '6',
      order: 3,
      isActive: true,
      lessonCount: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Exercícios dos Sonhos
    {
      id: '9',
      title: 'Membros Superiores',
      description: 'Treinos focados em membros superiores',
      courseId: '7',
      order: 1,
      isActive: true,
      lessonCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      title: 'Treino para Gestantes',
      description: 'Exercícios seguros para gestantes',
      courseId: '7',
      order: 2,
      isActive: true,
      lessonCount: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '11',
      title: 'Pernas Definidas',
      description: 'Treinos para pernas tonificadas',
      courseId: '7',
      order: 3,
      isActive: true,
      lessonCount: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      title: 'Treino de Mobilidade',
      description: 'Exercícios de mobilidade e flexibilidade',
      courseId: '7',
      order: 4,
      isActive: true,
      lessonCount: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '13',
      title: 'Bum Bum na Nuca',
      description: 'Treinos específicos para glúteos',
      courseId: '7',
      order: 5,
      isActive: true,
      lessonCount: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Estados do formulário
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    courseId: '',
    order: 1,
    isActive: true
  });

  const handleAddModule = () => {
    setIsAddDialogOpen(true);
    setFormData({
      title: '',
      description: '',
      courseId: '',
      order: 1,
      isActive: true
    });
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      courseId: module.courseId,
      order: module.order,
      isActive: module.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveModule = () => {
    if (editingModule) {
      // Editar módulo existente
      setModules(modules.map(module => 
        module.id === editingModule.id 
          ? { ...module, ...formData, updatedAt: new Date() }
          : module
      ));
      setIsEditDialogOpen(false);
      setEditingModule(null);
    } else {
      // Adicionar novo módulo
      const newModule: Module = {
        id: Date.now().toString(),
        ...formData,
        lessonCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setModules([...modules, newModule]);
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      title: '',
      description: '',
      courseId: '',
      order: 1,
      isActive: true
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const handleToggleActive = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, isActive: !module.isActive, updatedAt: new Date() }
        : module
    ));
  };

  const getCourseTitle = (courseId: string) => {
    return courses.find(course => course.id === courseId)?.title || 'Curso não encontrado';
  };

  const getModulesByCourse = (courseId: string) => {
    return modules.filter(module => module.courseId === courseId);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Módulos</h2>
          <p className="text-gray-600">Crie e gerencie seus módulos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddModule}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Módulo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Módulo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="course">Curso</Label>
                <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Módulo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Módulo 1: Fundamentos"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o conteúdo deste módulo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Ordem</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Módulo Ativo</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveModule}>
                Salvar Módulo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Módulos por Curso */}
      <div className="space-y-6">
        {courses.map((course) => {
          const courseModules = getModulesByCourse(course.id);
          return (
            <Card key={course.id} className="border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {course.title}
                  <Badge variant="outline" className="ml-auto">
                    {courseModules.length} módulos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseModules.length > 0 ? (
                  <div className="space-y-3">
                    {courseModules
                      .sort((a, b) => a.order - b.order)
                      .map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant={module.isActive ? "default" : "secondary"}>
                                  {module.isActive ? "Ativo" : "Inativo"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {module.lessonCount} aulas
                                </span>
                                <span className="text-sm text-gray-500">
                                  Ordem: {module.order}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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
                              onClick={() => handleToggleActive(module.id)}
                            >
                              {module.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteModule(module.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum módulo criado para este curso</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setFormData({...formData, courseId: course.id});
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Módulo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-course">Curso</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título do Módulo</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Módulo 1: Fundamentos"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o conteúdo deste módulo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-order">Ordem</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="edit-isActive">Módulo Ativo</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveModule}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 