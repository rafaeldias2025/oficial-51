import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, BookOpen, FileText, Clock, CheckCircle, Lock, Download } from 'lucide-react';
import { CourseLesson } from '@/types/admin';
import { cn } from '@/lib/utils';

interface LessonPlayerProps {
  lesson: CourseLesson;
  isCompleted?: boolean;
  userProgress?: number;
  nextLesson?: CourseLesson;
  onMarkCompleted?: () => void;
  onNextLesson?: () => void;
  className?: string;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  isCompleted = false,
  userProgress = 0,
  nextLesson,
  onMarkCompleted,
  onNextLesson,
  className
}) => {
  const getLessonTypeIcon = () => {
    if (lesson.video_url) return <Play className="h-5 w-5" />;
    return <BookOpen className="h-5 w-5" />;
  };

  const getLessonTypeBadge = () => {
    if (lesson.video_url) return "Video";
    return "Text";
  };

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getLessonTypeIcon()}
              <div>
                <h1 className="text-2xl font-bold">{lesson.title}</h1>
                {lesson.description && (
                  <p className="text-muted-foreground mt-1">{lesson.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getLessonTypeBadge()}</Badge>
              {lesson.duration_minutes && (
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.duration_minutes}min
                </Badge>
              )}
              {isCompleted && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video/Content Player */}
      <Card>
        <CardContent className="p-0">
          {lesson.video_url ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full"
                controls
                poster="/placeholder.svg"
              >
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="p-8">
              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Lesson Content</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {lesson.description || "This lesson contains text content that will be displayed here."}
                  </p>
                  
                  {/* Placeholder for actual lesson content */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold">Key Learning Points:</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Understanding the core concepts</li>
                      <li>Practical applications and examples</li>
                      <li>Best practices and recommendations</li>
                      <li>Common pitfalls to avoid</li>
                    </ul>
                  </div>

                  {/* Download button for resources */}
                  <div className="mt-6 pt-6 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resources
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lesson Progress</span>
                <span className="font-medium">{userProgress}%</span>
              </div>
              <Progress value={userProgress} className="h-2" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-3">
                {!isCompleted && userProgress >= 80 && (
                  <Button onClick={onMarkCompleted}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                
                {isCompleted && (
                  <Button variant="outline" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                )}
              </div>

              {nextLesson && (
                <Button 
                  onClick={onNextLesson}
                  disabled={!isCompleted && userProgress < 80}
                  className="min-w-fit"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Next: {nextLesson.title}
                  {(!isCompleted && userProgress < 80) && (
                    <Lock className="h-4 w-4 ml-2" />
                  )}
                </Button>
              )}
            </div>

            {/* Completion Requirements */}
            {!isCompleted && userProgress < 80 && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                📚 Complete at least 80% of this lesson to unlock the next one
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonPlayer;