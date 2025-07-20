import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CourseCardProps {
  id: string;
  title: string;
  type: 'CURSO' | 'MÓDULO';
  imageUrl: string;
  showTitle?: boolean;
  onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  id, 
  title, 
  type, 
  imageUrl, 
  showTitle = true, 
  onClick 
}) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock lessons data
  const mockLessons = [
    {
      id: '1',
      title: 'Introdução ao Curso',
      description: 'Aprenda os fundamentos básicos deste curso incrível.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: imageUrl,
      duration: '5:30'
    },
    {
      id: '2',
      title: 'Primeiros Passos',
      description: 'Comece sua jornada com os primeiros conceitos importantes.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: imageUrl,
      duration: '8:45'
    },
    {
      id: '3',
      title: 'Técnicas Avançadas',
      description: 'Explore técnicas mais avançadas para dominar o assunto.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: imageUrl,
      duration: '12:20'
    },
    {
      id: '4',
      title: 'Conclusão e Próximos Passos',
      description: 'Finalize o curso e descubra como continuar aprendendo.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: imageUrl,
      duration: '6:15'
    }
  ];

  const selectedLesson = mockLessons[currentLessonIndex];

  // Video control functions
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < mockLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden hover:bg-gray-50/50 transition-colors duration-300">
        <div className="relative aspect-video w-full">
          {/* Imagem de capa */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Overlay com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Botão de play com efeito hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={() => setIsPlayerOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 transform hover:scale-110 transition-all duration-300"
              size="icon"
            >
              <Play className="w-8 h-8" />
            </Button>
          </div>

          {/* Título e número de aulas sobrepostos na imagem */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-medium text-white line-clamp-1 mb-1">{title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/90">{mockLessons.length} aulas</span>
              <Button
                onClick={() => setShowQuiz(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20 px-2 py-1 h-7 text-xs backdrop-blur-sm rounded-full"
              >
                Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent 
          className="fixed left-0 top-0 z-50 w-screen h-screen max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-black p-0 shadow-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-none overflow-hidden"
        >
          <div className="flex h-full w-full">
            {/* Video Player - YouTube Style */}
            <div className="flex-1 flex items-start justify-center p-2 pt-8">
              <div 
                className="relative bg-black rounded-lg overflow-hidden w-full h-[60vh]"
                onMouseMove={handleMouseMove}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src={selectedLesson.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleNextLesson}
                />

                {/* Center Play Button */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={handlePlayPause}
                      className="bg-black/60 hover:bg-black/80 text-white p-6 rounded-full backdrop-blur-sm border border-white/20"
                      size="lg"
                    >
                      <Play className="w-12 h-12" />
                    </Button>
                  </div>
                )}

                {/* Navigation Controls - Inside Player */}
                {showControls && (
                  <div className="absolute inset-0 flex items-center justify-between px-6 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handlePreviousLesson}
                      disabled={currentLessonIndex === 0}
                      className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm rounded-full p-3 border border-white/20"
                    >
                      <SkipBack className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm rounded-full p-4 border border-white/20"
                    >
                      {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === mockLessons.length - 1}
                      className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm rounded-full p-3 border border-white/20"
                    >
                      <SkipForward className="w-6 h-6" />
                    </Button>
                  </div>
                )}

                {/* Progress Bar - YouTube Style */}
                {showControls && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300">
                    <Slider
                      value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="w-full mb-3"
                    />
                    <div className="flex justify-between text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson List Sidebar */}
            <div className="w-[500px] bg-gray-900 p-6 overflow-y-auto">
              <h3 className="text-white font-semibold text-xl mb-6">Aulas</h3>
              <div className="space-y-4">
                {mockLessons.slice(0, 4).map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      index === currentLessonIndex
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base truncate">{lesson.title}</h4>
                      <p className="text-sm opacity-75">{lesson.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Info - YouTube Style */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold text-xl mb-3">{selectedLesson.title}</h4>
                <p className="text-gray-300 text-base mb-4 leading-relaxed">{selectedLesson.description}</p>
              </div>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMuteToggle}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20 group transition-all duration-300 hover:like-button-hover"
                style={{ borderRadius: '12px', padding: '8px 16px' }}
              >
                <div className="flex items-center space-x-2">
                  <span className="group-hover:scale-110 transition-transform duration-300">📥</span>
                  <span className="text-sm">Download</span>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-md">
          <h3 className="text-lg font-semibold mb-4">Quiz do Curso</h3>
          <p className="text-gray-600 mb-4">
            Teste seus conhecimentos sobre o curso "{title}"
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => setShowQuiz(false)}>
              Iniciar Quiz
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowQuiz(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 