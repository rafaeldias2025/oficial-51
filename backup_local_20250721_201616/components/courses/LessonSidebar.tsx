import React, { useState } from 'react';
import { Play, Lock, CheckCircle, Download, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CourseModule, CourseLesson } from '@/types/admin';
import { AdvancedLessonManager } from '@/components/admin/AdvancedLessonManager';

interface LessonSidebarProps {
  modules: CourseModule[];
  currentLessonId?: string;
  onLessonSelect: (lesson: CourseLesson) => void;
  onAddLesson?: (moduleId: string) => void;
  completedLessons?: string[];
  isAdmin?: boolean;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  modules,
  currentLessonId,
  onLessonSelect,
  onAddLesson,
  completedLessons = [],
  isAdmin = false
}) => {
  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-3">
              {/* Module header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    Módulo {moduleIndex + 1}: {module.title}
                  </h3>
                  {module.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {module.description}
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <AdvancedLessonManager
                      moduleId={module.id}
                      module={module}
                      onLessonAdded={onAddLesson ? () => onAddLesson(module.id) : undefined}
                    />
                  </div>
                )}
              </div>

              {/* Lessons list */}
              <div className="space-y-2">
                {module.lessons?.map((lesson, lessonIndex) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;
                  const isLocked = false; // Implement your logic here

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => !isLocked && onLessonSelect(lesson)}
                      className={cn(
                        "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                        isCurrent
                          ? "bg-primary/20 border border-primary"
                          : "hover:bg-gray-800",
                        isLocked && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {/* Lesson status icon */}
                      <div className="flex-shrink-0">
                        {isLocked ? (
                          <Lock className="h-5 w-5 text-gray-500" />
                        ) : isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : isCurrent ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                          {isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Assistindo
                            </Badge>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      {/* Duration and actions */}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {lesson.duration_minutes && (
                          <span>{formatDuration(lesson.duration_minutes)}</span>
                        )}
                        {lesson.document_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(lesson.document_url, '_blank');
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        {lesson.video_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Implement download functionality
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}; 