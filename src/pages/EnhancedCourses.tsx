import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Settings,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { EnhancedCourseGrid } from '@/components/courses/EnhancedCourseGrid';
import { useCourses, Course } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const EnhancedCourses: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    courses, 
    loading, 
    isAdmin, 
    updateCourse, 
    deleteCourse,
    fetchCourses 
  } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = [...new Set(courses.map(course => course.category))];
    return cats.filter(Boolean);
  }, [courses]);

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Admin filter - show all courses for admin, only active for users
    if (!isAdmin) {
      filtered = filtered.filter(course => course.is_active);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, sortBy, isAdmin]);

  const handleCourseClick = (course: Course) => {
    navigate(`/courses/${course.id}`);
  };

  const handleEditCourse = (course: Course) => {
    navigate(`/admin/courses/${course.id}/edit`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (courseId: string, isActive: boolean) => {
    try {
      await updateCourse(courseId, { is_active: isActive });
      toast({
        title: "Success",
        description: `Course ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Premium Courses</h1>
              <p className="text-muted-foreground text-lg">
                Discover and learn from our curated collection of premium courses
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  Admin Mode
                </Badge>
                <Button onClick={() => navigate('/admin/courses')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Courses
                </Button>
                <Button onClick={() => navigate('/admin/courses/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="price-asc">Price Low-High</SelectItem>
                  <SelectItem value="price-desc">Price High-Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" onClick={() => setSelectedCategory('all')}>
                  {selectedCategory} ×
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 pb-12">
        {filteredCourses.length > 0 ? (
          <EnhancedCourseGrid
            courses={filteredCourses}
            isAdmin={isAdmin}
            onCourseClick={handleCourseClick}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onToggleActive={handleToggleActive}
          />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
              {isAdmin && (
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/admin/courses/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Course
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedCourses;