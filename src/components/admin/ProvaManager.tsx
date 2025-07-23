import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  BookOpen,
  CheckCircle
} from 'lucide-react';

interface Prova {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  courseId?: string;
  courseName?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  totalAttempts: number;
  averageScore: number;
}

export const ProvaManager: React.FC = () => {
  const [provas, setProvas] = useState<Prova[]>([
    {
      id: '1',
      title: 'Prova de Coaching Básico',
      description: 'Avaliação dos conceitos fundamentais de coaching',
      duration: 60,
      totalQuestions: 20,
      passingScore: 70,
      courseId: 'course1',
      courseName: 'Fundamentos do Coaching',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      totalAttempts: 45,
      averageScore: 78
    },
    {
      id: '2',
      title: 'Prova Avançada de Liderança',
      description: 'Teste de conhecimentos avançados em liderança',
      duration: 90,
      totalQuestions: 30,
      passingScore: 75,
      courseId: 'course2',
      courseName: 'Liderança Executiva',
      status: 'active',
      createdAt: new Date('2024-02-01'),
      totalAttempts: 23,
      averageScore: 82
    },
    {
      id: '3',
      title: 'Certificação Final',
      description: 'Prova final para certificação completa',
      duration: 120,
      totalQuestions: 50,
      passingScore: 80,
      status: 'draft',
      createdAt: new Date('2024-03-01'),
      totalAttempts: 0,
      averageScore: 0
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 10,
    passingScore: 70,
    courseName: '',
  });

  const handleOpenModal = () => {
    setForm({
      title: '',
      description: '',
      duration: 60,
      totalQuestions: 10,
      passingScore: 70,
      courseName: '',
    });
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProvas([
      ...provas,
      {
        id: (provas.length + 1).toString(),
        title: form.title,
        description: form.description,
        duration: Number(form.duration),
        totalQuestions: Number(form.totalQuestions),
        passingScore: Number(form.passingScore),
        courseName: form.courseName,
        status: 'draft',
        createdAt: new Date(),
        totalAttempts: 0,
        averageScore: 0,
      },
    ]);
    setModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'inactive':
        return 'Inativa';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sistema de Provas</h2>
          <p className="text-muted-foreground">
            Gerencie provas e avaliações dos cursos
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Nova Prova
        </Button>
      {/* Modal de Nova Prova */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Prova</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" label="Título" placeholder="Título da prova" value={form.title} onChange={handleChange} required />
            <Textarea name="description" label="Descrição" placeholder="Descrição da prova" value={form.description} onChange={handleChange} required />
            <div className="flex gap-2">
              <Input name="courseName" label="Aula/Curso" placeholder="Nome da aula ou curso" value={form.courseName} onChange={handleChange} />
              <Input name="duration" label="Duração (min)" type="number" min={1} value={form.duration} onChange={handleChange} />
            </div>
            <div className="flex gap-2">
              <Input name="totalQuestions" label="Total de Questões" type="number" min={1} value={form.totalQuestions} onChange={handleChange} />
              <Input name="passingScore" label="Nota mínima (%)" type="number" min={0} max={100} value={form.passingScore} onChange={handleChange} />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Provas</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{provas.length}</div>
            <p className="text-xs text-muted-foreground">
              {provas.filter(p => p.status === 'active').length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tentativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {provas.reduce((sum, p) => sum + p.totalAttempts, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as provas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(provas.filter(p => p.averageScore > 0).reduce((sum, p) => sum + p.averageScore, 0) / provas.filter(p => p.averageScore > 0).length || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Score médio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Aprovações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Provas List */}
      <div className="grid gap-4">
        {provas.map((prova) => (
          <Card key={prova.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{prova.title}</h3>
                    <Badge className={getStatusColor(prova.status)}>
                      {getStatusText(prova.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{prova.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{prova.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{prova.totalQuestions} questões</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Nota mínima: {prova.passingScore}%</span>
                    </div>
                    {prova.courseName && (
                      <div className="flex items-center space-x-1">
                        <span>Curso: {prova.courseName}</span>
                      </div>
                    )}
                  </div>
                  {prova.status === 'active' && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600">
                        {prova.totalAttempts} tentativas
                      </span>
                      <span className="text-blue-600">
                        Média: {prova.averageScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
