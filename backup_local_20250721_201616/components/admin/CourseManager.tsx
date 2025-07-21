import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, Users, Clock, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  isPremium: boolean;
  moduleCount: number;
  lessonCount: number;
  studentCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  isPremium: boolean;
}

export const CourseManager: React.FC = () => {
  // Dados mockados para demonstração
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: '7 CHAVES',
      description: 'As 7 chaves fundamentais para o sucesso na vida',
      category: 'Desenvolvimento Pessoal',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 1,
      lessonCount: 7,
      studentCount: 15420,
      rating: 4.9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: '12 CHÁS',
      description: 'Aprenda a preparar chás medicinais para saúde',
      category: 'Saúde Natural',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 1,
      lessonCount: 5,
      studentCount: 12350,
      rating: 4.8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'PÍLULAS DO BEM',
      description: 'Suplementos essenciais para saúde e bem-estar',
      category: 'Nutrição',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 1,
      lessonCount: 8,
      studentCount: 9870,
      rating: 4.7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      title: 'Jejum Intermitente',
      description: 'Guia completo do jejum intermitente',
      category: 'Nutrição',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 1,
      lessonCount: 6,
      studentCount: 8760,
      rating: 4.6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      title: 'Dia a Dia',
      description: 'Rotinas diárias para uma vida mais saudável',
      category: 'Bem-estar',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 1,
      lessonCount: 4,
      studentCount: 6540,
      rating: 4.5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      title: 'Doces dos Sonhos',
      description: 'Receitas de doces saudáveis e deliciosos',
      category: 'Culinária',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 3,
      lessonCount: 24,
      studentCount: 5430,
      rating: 4.4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      title: 'Exercícios dos Sonhos',
      description: 'Treinos completos para transformar seu corpo',
      category: 'Fitness',
      price: 0,
      isActive: true,
      isPremium: false,
      moduleCount: 5,
      lessonCount: 54,
      studentCount: 4320,
      rating: 4.3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Estados do formulário
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    isActive: true,
    isPremium: false
  });

  const categories = [
    'Desenvolvimento Pessoal',
    'Saúde Natural',
    'Nutrição',
    'Bem-estar',
    'Culinária',
    'Fitness',
    'Meditação',
    'Yoga'
  ];

  const handleAddCourse = () => {
    setIsAddDialogOpen(true);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: 0,
      isActive: true,
      isPremium: false
    });
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      isActive: course.isActive,
      isPremium: course.isPremium
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveCourse = () => {
    if (editingCourse) {
      // Editar curso existente
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...formData, updatedAt: new Date() }
          : course
      ));
      setIsEditDialogOpen(false);
      setEditingCourse(null);
    } else {
      // Adicionar novo curso
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
        moduleCount: 0,
        lessonCount: 0,
        studentCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCourses([...courses, newCourse]);
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      title: '',
      description: '',
      category: '',
      price: 0,
      isActive: true,
      isPremium: false
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const handleToggleActive = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, isActive: !course.isActive, updatedAt: new Date() }
        : course
    ));
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cursos</h2>
          <p className="text-gray-600">Crie e gerencie seus cursos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCourse}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Curso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Curso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: 7 CHAVES"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o conteúdo deste curso"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Curso Ativo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({...formData, isPremium: checked})}
                />
                <Label htmlFor="isPremium">Curso Premium</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCourse}>
                Salvar Curso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </div>
                <Badge variant={course.isActive ? "default" : "secondary"}>
                  {course.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span>{course.moduleCount} módulos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{course.lessonCount} aulas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{course.studentCount.toLocaleString()} alunos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Category and Price */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                <span className="text-sm font-medium text-green-600">
                  {formatPrice(course.price)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditCourse(course)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(course.id)}
                >
                  {course.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título do Curso</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: 7 CHAVES"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o conteúdo deste curso"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Preço</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="edit-isActive">Curso Ativo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) => setFormData({...formData, isPremium: checked})}
              />
              <Label htmlFor="edit-isPremium">Curso Premium</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 