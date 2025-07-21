import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Circle,
  Clock,
  BookOpen
} from 'lucide-react';
import { useCourseManagement, CourseWithModules, CourseLesson } from '@/hooks/useCourseManagement';

interface CoursePlayerProps {
  course: CourseWithModules;
  className?: string;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  className = ""
}) => {
  const { getUserProgress, markLessonCompleted } = useCourseManagement();
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playlistCollapsed, setPlaylistCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Initialize with first lesson
  useEffect(() => {
    if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setCurrentLesson(course.modules[0].lessons[0]);
      setExpandedModules([course.modules[0].id]);
    }
  }, [course]);

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      const userProgress = await getUserProgress(course.id);
      const completed = userProgress
        .filter(p => p.completed)
        .map(p => p.lesson_id);
      setCompletedLessons(completed);
    };
    loadProgress();
  }, [course.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectLesson = (lesson: CourseLesson) => {
    setCurrentLesson(lesson);
    setPlaying(false);
    setProgress(0);
  };

  const markCurrentLessonCompleted = async () => {
    if (currentLesson) {
      await markLessonCompleted(course.id, currentLesson.id);
      setCompletedLessons(prev => [...prev, currentLesson.id]);
    }
  };

  const getNextLesson = (): CourseLesson | null => {
    if (!currentLesson) return null;
    
    for (const module of course.modules) {
      const lessonIndex = module.lessons.findIndex(l => l.id === currentLesson.id);
      if (lessonIndex !== -1) {
        // Next lesson in same module
        if (lessonIndex < module.lessons.length - 1) {
          return module.lessons[lessonIndex + 1];
        }
        // First lesson of next module
        const moduleIndex = course.modules.findIndex(m => m.id === module.id);
        if (moduleIndex < course.modules.length - 1) {
          const nextModule = course.modules[moduleIndex + 1];
          if (nextModule.lessons.length > 0) {
            return nextModule.lessons[0];
          }
        }
      }
    }
    return null;
  };

  const getPreviousLesson = (): CourseLesson | null => {
    if (!currentLesson) return null;
    
    for (const module of course.modules) {
      const lessonIndex = module.lessons.findIndex(l => l.id === currentLesson.id);
      if (lessonIndex !== -1) {
        // Previous lesson in same module
        if (lessonIndex > 0) {
          return module.lessons[lessonIndex - 1];
        }
        // Last lesson of previous module
        const moduleIndex = course.modules.findIndex(m => m.id === module.id);
        if (moduleIndex > 0) {
          const prevModule = course.modules[moduleIndex - 1];
          if (prevModule.lessons.length > 0) {
            return prevModule.lessons[prevModule.lessons.length - 1];
          }
        }
      }
    }
    return null;
  };

  const goToNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      selectLesson(nextLesson);
    }
  };

  const goToPreviousLesson = () => {
    const prevLesson = getPreviousLesson();
    if (prevLesson) {
      selectLesson(prevLesson);
    }
  };

  const calculateCourseProgress = () => {
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedCount = completedLessons.length;
    return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma aula selecionada</h3>
          <p className="text-muted-foreground">Selecione uma aula na playlist para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Video Player */}
      <div className={`lg:col-span-${playlistCollapsed ? '4' : '3'} space-y-4`}>
        {/* Course Header */}
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <Badge variant="outline" className="shrink-0">
              {course.category}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso do Curso</span>
              <span>{Math.round(calculateCourseProgress())}%</span>
            </div>
            <Progress value={calculateCourseProgress()} className="h-2" />
          </div>
        </div>

        {/* Video Container */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            {/* Video Embed */}
            <iframe
              src={currentLesson.video_url}
              title={currentLesson.title}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Video Controls */}
          <div className="p-4 bg-card border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{currentLesson.title}</h2>
                <p className="text-sm text-muted-foreground">{currentLesson.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(currentLesson.duration_minutes)}
                </Badge>
                {completedLessons.includes(currentLesson.id) && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Concluída
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousLesson}
                  disabled={!getPreviousLesson()}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPlaying(!playing)}
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextLesson}
                  disabled={!getNextLesson()}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={markCurrentLessonCompleted}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como Concluída
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Playlist Sidebar */}
      <AnimatePresence>
        {!playlistCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="lg:col-span-1"
          >
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conteúdo do Curso</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPlaylistCollapsed(true)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {course.modules.map((module) => (
                  <div key={module.id} className="border rounded-lg">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-3 h-auto"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{module.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {module.lessons.length} aulas
                        </div>
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>

                    <AnimatePresence>
                      {expandedModules.includes(module.id) && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 pt-0 space-y-1">
                            {module.lessons.map((lesson) => (
                              <Button
                                key={lesson.id}
                                variant={currentLesson?.id === lesson.id ? "default" : "ghost"}
                                className="w-full justify-start h-auto p-2 text-left"
                                onClick={() => selectLesson(lesson)}
                              >
                                <div className="flex items-start gap-2 w-full">
                                  {completedLessons.includes(lesson.id) ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-xs truncate">
                                      {lesson.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDuration(lesson.duration_minutes)}
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Playlist Button */}
      {playlistCollapsed && (
        <Button
          variant="outline"
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
          onClick={() => setPlaylistCollapsed(false)}
        >
          <BookOpen className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};