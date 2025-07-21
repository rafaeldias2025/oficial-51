import React, { useState } from 'react';

interface EnhancedLessonPlayerProps {
  courseId?: string;
  lessonId?: string;
  modules?: any[];
}

export const EnhancedLessonPlayer: React.FC<EnhancedLessonPlayerProps> = ({ courseId, lessonId, modules }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1800); // 30 minutos

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Player de Aula</h2>
      
      <div className="mb-6">
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Fundamentos de Meditação</h3>
            <p className="text-gray-300">Aula 1: Introdução à Meditação</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-center gap-4 mb-6">
        <button className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
          <span className="text-xl">⏮️</span>
        </button>
        
        <button 
          onClick={handlePlayPause}
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90"
        >
          <span className="text-white text-2xl">
            {isPlaying ? '⏸️' : '▶️'}
          </span>
        </button>
        
        <button className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
          <span className="text-xl">⏭️</span>
        </button>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Controles</h4>
        <div className="flex gap-2">
          <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90">
            Velocidade 1x
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
            Legendas
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
            Notas
          </button>
        </div>
      </div>
    </div>
  );
}; 