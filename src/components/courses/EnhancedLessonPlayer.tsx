import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronLeft, ChevronRight, FileText, Download, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { CourseLesson, CourseModule } from '@/types/admin';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { VideoPlayer } from './VideoPlayer';
import { LessonSidebar } from './LessonSidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EnhancedLessonPlayerProps {
  courseId: string;
  lessonId: string;
  modules: CourseModule[];
}

export const EnhancedLessonPlayer: React.FC<EnhancedLessonPlayerProps> = ({ courseId, lessonId, modules }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { markLessonAsCompleted, getUserProgress, isAdmin } = useCourses();
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showAddLessonDialog, setShowAddLessonDialog] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0
  });

  useEffect(() => {
    // Find the current lesson
    let foundLesson: CourseLesson | null = null;
    modules.forEach(module => {
      module.lessons?.forEach(lesson => {
        if (lesson.id === lessonId) {
          foundLesson = lesson;
        }
      });
    });
    setCurrentLesson(foundLesson);

    // Load user progress
    loadUserProgress();
  }, [lessonId, modules]);

  const loadUserProgress = async () => {
    const progress = await getUserProgress(courseId);
    setUserProgress(progress);
    
    // Extract completed lesson IDs
    const completed = progress
      .filter(p => p.completed)
      .map(p => p.lesson_id);
    setCompletedLessons(completed);
    
    // Check if current lesson is completed
    const lessonProgress = progress.find(p => p.lesson_id === lessonId);
    if (lessonProgress?.completed) {
      setIsCompleted(true);
      setProgress(100);
    }
  };

  const handleComplete = async () => {
    if (!currentLesson) return;

    try {
      await markLessonAsCompleted(courseId, lessonId);
      setIsCompleted(true);
      setProgress(100);
      setCompletedLessons([...completedLessons, lessonId]);
      toast({
        title: "Aula concluída!",
        description: "Parabéns! Você completou esta aula.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao marcar aula como concluída",
        variant: "destructive",
      });
    }
  };

  const handleLessonSelect = (lesson: CourseLesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  const handleAddLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setShowAddLessonDialog(true);
  };

  const handleCreateLesson = async () => {
    try {
      // TODO: Implement lesson creation
      toast({
        title: "Em desenvolvimento",
        description: "Função de criar aula será implementada em breve",
      });
      setShowAddLessonDialog(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar aula",
        variant: "destructive",
      });
    }
  };

  const handleVideoEnd = () => {
    if (!isCompleted) {
      handleComplete();
    }
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (duration > 0) {
      const progressPercentage = (currentTime / duration) * 100;
      setProgress(Math.min(progressPercentage, 100));
    }
  };

  const navigateToLesson = (direction: 'prev' | 'next') => {
    if (!currentLesson) return;

    let allLessons: (CourseLesson & { moduleId: string })[] = [];
    modules.forEach(module => {
      module.lessons?.forEach(lesson => {
        allLessons.push({ ...lesson, moduleId: module.id });
      });
    });

    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < allLessons.length) {
      navigate(`/courses/${courseId}/lessons/${allLessons[targetIndex].id}`);
    }
  };

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Aula não encontrada</p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>
            Voltar ao curso
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao curso
            </Button>
            {isCompleted && (
              <Badge className="flex items-center gap-1 bg-green-600 text-white">
                <CheckCircle className="h-4 w-4" />
                Concluída
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Video player area */}
        <div className="flex-1 flex flex-col">
          {/* Video */}
          <div className="flex-1 p-6">
            {currentLesson.video_url ? (
              <VideoPlayer
                videoUrl={currentLesson.video_url}
                title={currentLesson.title}
                onEnded={handleVideoEnd}
                onTimeUpdate={handleTimeUpdate}
                className="h-full"
              />
            ) : (
              <div className="h-full bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Nenhum vídeo disponível para esta aula</p>
              </div>
            )}
          </div>

          {/* Lesson info and controls */}
          <div className="p-6 pt-0 space-y-4">
            {/* Title and description */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
              {currentLesson.description && (
                <p className="text-gray-400">{currentLesson.description}</p>
              )}
            </div>

            {/* Attachments */}
            {(currentLesson.document_url || currentLesson.image_url) && (
              <div className="flex gap-4">
                {currentLesson.document_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(currentLesson.document_url, '_blank')}
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Documento
                  </Button>
                )}
                {currentLesson.image_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(currentLesson.image_url, '_blank')}
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Ver Imagem
                  </Button>
                )}
              </div>
            )}

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progresso</span>
                <span className="text-gray-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateToLesson('prev')}
                className="text-white border-gray-700 hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Aula Anterior
              </Button>

              {!isCompleted && (
                <Button 
                  onClick={handleComplete}
                  className="bg-primary hover:bg-primary/90"
                >
                  Marcar como Concluída
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigateToLesson('next')}
                className="text-white border-gray-700 hover:bg-gray-800"
              >
                Próxima Aula
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar with lessons */}
        <div className="w-96 border-l border-gray-800">
          <LessonSidebar
            modules={modules}
            currentLessonId={lessonId}
            onLessonSelect={handleLessonSelect}
            onAddLesson={isAdmin ? handleAddLesson : undefined}
            completedLessons={completedLessons}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* Add Lesson Dialog */}
      <Dialog open={showAddLessonDialog} onOpenChange={setShowAddLessonDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Aula</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os dados da nova aula
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={newLessonForm.title}
                onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
                placeholder="Ex: Introdução ao módulo"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={newLessonForm.description}
                onChange={(e) => setNewLessonForm({ ...newLessonForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700"
                placeholder="Descreva o conteúdo da aula"
              />
            </div>
            <div>
              <Label>URL do Vídeo</Label>
              <Input
                value={newLessonForm.video_url}
                onChange={(e) => setNewLessonForm({ ...newLessonForm, video_url: e.target.value })}
                className="bg-gray-800 border-gray-700"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Duração (minutos)</Label>
              <Input
                type="number"
                value={newLessonForm.duration_minutes}
                onChange={(e) => setNewLessonForm({ ...newLessonForm, duration_minutes: parseInt(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700"
                placeholder="30"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddLessonDialog(false)}
                className="text-white border-gray-700 hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateLesson}
                disabled={!newLessonForm.title || !newLessonForm.video_url}
              >
                Criar Aula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 