import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Edit3, 
  Eye,
  Settings,
  MoreVertical
} from 'lucide-react';
import { Course } from '@/hooks/useCourses';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface EnhancedCourseGridProps {
  courses: Course[];
  isAdmin?: boolean;
  onCourseClick?: (course: Course) => void;
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onToggleActive?: (courseId: string, isActive: boolean) => void;
  className?: string;
}

export const EnhancedCourseGrid: React.FC<EnhancedCourseGridProps> = ({
  courses,
  isAdmin = false,
  onCourseClick,
  onEditCourse,
  onDeleteCourse,
  onToggleActive,
  className
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCourseAction = (course: Course, action: 'view' | 'edit') => {
    if (action === 'view') {
      onCourseClick?.(course);
    } else if (action === 'edit') {
      onEditCourse?.(course);
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {courses.map((course) => (
        <Card
          key={course.id}
          className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            "cursor-pointer border-2 hover:border-primary/20"
          )}
          onMouseEnter={() => setHoveredCard(course.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Course Image/Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={course.image_url || '/placeholder.svg'}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCourseAction(course, 'view')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Course
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCourseAction(course, 'edit')}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleActive?.(course.id, !course.is_active)}>
                      <Settings className="h-4 w-4 mr-2" />
                      {course.is_active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-2 left-2">
              {!course.is_active ? (
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </Badge>
              ) : course.price > 0 ? (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Free
                </Badge>
              )}
            </div>

            {/* Play Button Overlay */}
            <div 
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                hoveredCard === course.id ? "opacity-100" : "opacity-0"
              )}
            >
              <Button
                size="lg"
                onClick={() => onCourseClick?.(course)}
                className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
              >
                <Play className="h-6 w-6 mr-2" />
                {course.progress ? 'Continue' : 'Start'}
              </Button>
            </div>
          </div>

          {/* Course Content */}
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {course.description}
                </p>
              </div>
              {course.rating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Course Metadata */}
            <div className="space-y-3">
              {/* Category and Level */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                {course.level && (
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                )}
              </div>

              {/* Course Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules?.length || 0} modules</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar (for users) */}
              {!isAdmin && course.progress !== undefined && course.progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}

              {/* Price (for admins) */}
              {isAdmin && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <Button
                className="w-full"
                variant={course.progress ? "outline" : "default"}
                onClick={() => onCourseClick?.(course)}
              >
                <Play className="h-4 w-4 mr-2" />
                {course.progress ? `Continue (${course.progress}%)` : 'Start Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};