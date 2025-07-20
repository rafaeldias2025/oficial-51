import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Edit3, BookOpen, Plus } from 'lucide-react';
import { CourseModulesSection } from '@/components/courses/CourseModulesSection';
// useCourses temporariamente desabilitado
import { CourseModule } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Hook temporariamente substituído por dados mock
  const courses: any[] = [];
  const loading = false;
  const isAdmin = false;
  const fetchCourseModules = async (courseId: string) => [];
  const getUserProgress = async (courseId: string) => [];

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        loadCourseData(courseId);
      } else {
        toast({
          title: "Course not found",
          description: "The requested course could not be found.",
          variant: "destructive"
        });
        navigate('/courses');
      }
    }
  }, [courseId, courses, navigate, toast]);

  const loadCourseData = async (courseId: string) => {
    try {
      setIsLoadingModules(true);
      const [moduleData, progressData] = await Promise.all([
        fetchCourseModules(courseId),
        getUserProgress(courseId)
      ]);
      setModules(moduleData);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error loading course",
        description: "Failed to load course content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleStartCourse = () => {
    if (modules.length > 0 && modules[0].lessons?.length > 0) {
      const firstLesson = modules[0].lessons[0];
      handlePlayLesson(firstLesson.id);
    }
  };

  const handleResumeCourse = () => {
    // Find the first incomplete lesson
    for (const module of modules) {
      if (module.lessons) {
        for (const lesson of module.lessons) {
          const isCompleted = userProgress.some(p => 
            p.lesson_id === lesson.id && p.completed
          );
          if (!isCompleted) {
            handlePlayLesson(lesson.id);
            return;
          }
        }
      }
    }
    // If all lessons are completed, start from the first one
    handleStartCourse();
  };

  const handlePlayLesson = (lessonId: string) => {
    // Navigate to lesson player
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  const handleEditCoverVideo = () => {
    // Navigate to admin course edit
    navigate(`/admin/courses/${courseId}/edit`);
  };

  const handleEditModule = (module: CourseModule) => {
    // Navigate to admin module edit
    navigate(`/admin/courses/${courseId}/modules/${module.id}/edit`);
  };

  const handleDeleteModule = async (moduleId: string) => {
    // Implement module deletion
    console.log('Delete module:', moduleId);
  };

  const handleAddLesson = (moduleId: string) => {
    // Navigate to create lesson
    navigate(`/admin/courses/${courseId}/modules/${moduleId}/lessons/new`);
  };

  const handleEditLesson = (lesson: any) => {
    // Navigate to edit lesson
    navigate(`/admin/courses/${courseId}/lessons/${lesson.id}/edit`);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    // Implement lesson deletion
    console.log('Delete lesson:', lessonId);
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
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
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
            
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Admin Mode
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/courses/${courseId}`)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Course
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Temporariamente desabilitado */}
      <div className="bg-muted p-8 text-center">
        <h1 className="text-2xl font-bold">{course?.title}</h1>
        <p className="text-muted-foreground mt-2">{course?.description}</p>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoadingModules ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading modules...</p>
            </div>
          </div>
        ) : modules.length > 0 ? (
          <CourseModulesSection
            courseId={courseId!}
            modules={modules}
            userProgress={userProgress}
            isAdmin={isAdmin}
            onPlayLesson={handlePlayLesson}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No modules available</h3>
                <p>This course doesn't have any modules yet.</p>
              </div>
              {isAdmin && (
                <Button onClick={() => navigate(`/admin/courses/${courseId}/modules/new`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Module
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoursePage;