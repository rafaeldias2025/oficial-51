import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { LessonPlayer } from '@/components/courses/LessonPlayer';
import { useCourses } from '@/hooks/useCourses';
import { CourseLesson } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const LessonPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    fetchCourseModules, 
    getUserProgress,
    markLessonAsCompleted,
    isAdmin 
  } = useCourses();

  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<CourseLesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessonData = async () => {
      if (!courseId || !lessonId) return;

      try {
        setLoading(true);
        const [modules, progress] = await Promise.all([
          fetchCourseModules(courseId),
          getUserProgress(courseId)
        ]);

        // Find current lesson and next lesson
        let currentLesson: CourseLesson | null = null;
        let nextLessonFound: CourseLesson | null = null;
        let foundCurrent = false;

        for (const module of modules) {
          if (module.lessons) {
            for (const l of module.lessons) {
              if (l.id === lessonId) {
                currentLesson = l;
                foundCurrent = true;
              } else if (foundCurrent && !nextLessonFound) {
                nextLessonFound = l;
                break;
              }
            }
            if (nextLessonFound) break;
          }
        }

        if (!currentLesson) {
          toast({
            title: "Lesson not found",
            description: "The requested lesson could not be found.",
            variant: "destructive"
          });
          navigate(`/courses/${courseId}`);
          return;
        }

        setLesson(currentLesson);
        setNextLesson(nextLessonFound);

        // Check if lesson is completed
        const lessonProgress = progress.find(p => p.lesson_id === lessonId);
        setIsCompleted(lessonProgress?.completed || false);
        setUserProgress(lessonProgress?.progress_percentage || 0);

      } catch (error) {
        console.error('Error loading lesson data:', error);
        toast({
          title: "Error",
          description: "Failed to load lesson. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [courseId, lessonId, fetchCourseModules, getUserProgress, navigate, toast]);

  const handleMarkCompleted = async () => {
    if (!courseId || !lessonId) return;

    try {
      await markLessonAsCompleted(courseId, lessonId);
      setIsCompleted(true);
      setUserProgress(100);
      toast({
        title: "Lesson completed!",
        description: "Great job! You've completed this lesson.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as completed.",
        variant: "destructive"
      });
    }
  };

  const handleNextLesson = () => {
    if (nextLesson && courseId) {
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Lesson not found</p>
          <Button 
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4"
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
            
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/courses/${courseId}/lessons/${lessonId}/edit`)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Lesson
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Lesson Content */}
      <div className="container mx-auto px-4 py-8">
        <LessonPlayer
          lesson={lesson}
          isCompleted={isCompleted}
          userProgress={userProgress}
          nextLesson={nextLesson}
          onMarkCompleted={handleMarkCompleted}
          onNextLesson={handleNextLesson}
        />
      </div>
    </div>
  );
};

export default LessonPlayerPage;