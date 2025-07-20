import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ModernVideoPlayerProps {
  videoUrl: string;
  title: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const ModernVideoPlayer: React.FC<ModernVideoPlayerProps> = ({
  videoUrl,
  title,
  onEnded,
  onTimeUpdate
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Inicializar volume quando o vídeo carrega
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 1;
      videoRef.current.muted = false;
      setVolume(1);
      setMuted(false);
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing, showControls]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const totalDuration = videoRef.current.duration;
      const progressValue = totalDuration > 0 ? current / totalDuration : 0;
      
      setCurrentTime(current);
      setProgress(progressValue);
      onTimeUpdate?.(current, totalDuration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const totalDuration = videoRef.current.duration;
      setDuration(totalDuration);
      
      // Garantir que o volume inicial seja 1
      videoRef.current.volume = 1;
      setVolume(1);
      setMuted(false);
      videoRef.current.muted = false;
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current && duration > 0) {
      const seekTime = value[0] * duration;
      videoRef.current.currentTime = seekTime;
      setProgress(value[0]);
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      
      // Se o volume for 0, ativar mute
      if (newVolume === 0) {
        setMuted(true);
        videoRef.current.muted = true;
      } else if (muted && newVolume > 0) {
        // Se estava mutado e aumentou o volume, desmutar
        setMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !muted;
      setMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 10);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(duration, videoRef.current.currentTime + 10);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (playing) {
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 1000);
        }
      }}
    >
      {/* Player */}
      <div className="aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      {/* Overlay de Controles */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Controles Superiores */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
            <h2 className="text-white text-lg font-semibold drop-shadow-lg">{title}</h2>
            <p className="text-gray-200 text-sm drop-shadow-lg">Aula em andamento</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm" onClick={toggleFullscreen}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controles Centrais */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm" onClick={skipBackward}>
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm rounded-full p-4"
              onClick={togglePlay}
            >
              {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm" onClick={skipForward}>
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Controles Inferiores */}
        <div className="absolute bottom-4 left-4 right-4 space-y-4">
          {/* Barra de Progresso */}
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={1}
              step={0.001}
              className="flex-1"
            />
            <span className="text-white text-sm bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controles de Volume */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm" onClick={toggleMute}>
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[muted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 