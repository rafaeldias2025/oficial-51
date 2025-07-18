import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  CheckCircle,
  Clock,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { CourseModule, CourseLesson } from '@/types/admin';
import { cn } from '@/lib/utils';

interface CourseModulesSectionProps {
  courseId: string;
  modules: CourseModule[];
  userProgress?: any[];
  isAdmin?: boolean;
  onPlayLesson?: (lessonId: string) => void;
  onEditModule?: (module: CourseModule) => void;
  onDeleteModule?: (moduleId: string) => void;
  onAddLesson?: (moduleId: string) => void;
  onEditLesson?: (lesson: CourseLesson) => void;
  onDeleteLesson?: (lessonId: string) => void;
  className?: string;
}

export const CourseModulesSection: React.FC<CourseModulesSectionProps> = ({
  courseId,
  modules,
  userProgress = [],
  isAdmin = false,
  onPlayLesson,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  className
}) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Auto-open first module
    if (modules.length > 0) {
      setOpenModules({ [modules[0].id]: true });
    }
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'text':
        return <BookOpen className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getModuleProgress = (module: CourseModule) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completedLessons = module.lessons.filter(lesson => 
      isLessonCompleted(lesson.id)
    ).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  return (
    <section className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        {isAdmin && (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => {
          const progress = getModuleProgress(module);
          const isOpen = openModules[module.id];

          return (
            <Card key={module.id} className="overflow-hidden">
              <Collapsible open={isOpen} onOpenChange={() => toggleModule(module.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            {module.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!isAdmin && (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              {progress}%
                            </span>
                          </div>
                        )}
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditModule?.(module);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteModule?.(module.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(lesson.id);
                        
                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border transition-colors",
                              isCompleted 
                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                                : "bg-muted/30 hover:bg-muted/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  getLessonIcon(lesson.video_url ? 'video' : 'text')
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {lessonIndex + 1}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                {lesson.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {lesson.duration_minutes && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration_minutes}min
                                </div>
                              )}
                              
                              {!isAdmin ? (
                                <Button
                                  variant={isCompleted ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => onPlayLesson?.(lesson.id)}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  {isCompleted ? 'Review' : 'Start'}
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditLesson?.(lesson)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteLesson?.(lesson.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddLesson?.(module.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Lesson
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </section>
  );
};