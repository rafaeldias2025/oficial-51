import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Edit3, Upload } from 'lucide-react';
import { Course } from '@/hooks/useCourses';
import { cn } from '@/lib/utils';

interface CourseHeroSectionProps {
  course: Course;
  isAdmin?: boolean;
  onEditCoverVideo?: () => void;
  onStartCourse?: () => void;
  onResumeCourse?: () => void;
  className?: string;
}

export const CourseHeroSection: React.FC<CourseHeroSectionProps> = ({
  course,
  isAdmin = false,
  onEditCoverVideo,
  onStartCourse,
  onResumeCourse,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (course.cover_video_url) {
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          setVideoError(true);
          setShowVideo(false);
        });
      }
    }
  }, [course.cover_video_url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setShowVideo(false);
  };

  return (
    <section className={cn("relative w-full h-[60vh] min-h-[400px] overflow-hidden", className)}>
      {/* Video or Image Background */}
      {showVideo && course.cover_video_url && !videoError ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onError={handleVideoError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={course.cover_video_url} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${course.image_url || '/placeholder.svg'})`
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Admin Edit Button */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditCoverVideo}
            className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>
      )}

      {/* Video Controls */}
      {showVideo && course.cover_video_url && !videoError && (
        <div className="absolute bottom-4 left-4 z-20 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlay}
            className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleMute}
            className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8">
        <div className="max-w-4xl">
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="mb-4 bg-primary/20 text-primary-foreground border-primary/30"
          >
            {course.category}
          </Badge>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {course.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl line-clamp-3">
            {course.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mb-6 text-white/80">
            {course.instructor && (
              <span className="flex items-center gap-2">
                <span className="font-medium">Instrutor:</span>
                {course.instructor}
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-2">
                <span className="font-medium">Duração:</span>
                {course.duration}
              </span>
            )}
            {course.level && (
              <Badge variant="outline" className="text-white border-white/30">
                {course.level}
              </Badge>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={course.progress ? onResumeCourse : onStartCourse}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="h-5 w-5 mr-2" />
              {course.progress ? 'Continue Course' : 'Start Course'}
            </Button>
            
            {course.progress && (
              <div className="flex items-center gap-2 text-white/80">
                <span>Progress: {course.progress}%</span>
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};