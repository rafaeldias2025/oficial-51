import React, { useState } from 'react';

interface SessionPlayerProps {
  sessionId?: string;
  onComplete?: (results: any) => void;
  onBack?: () => void;
}

export const SessionPlayer: React.FC<SessionPlayerProps> = ({ sessionId, onComplete, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(900); // 15 minutos em segundos

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
      <h2 className="text-2xl font-bold mb-6">Player de Sessão</h2>
      
      <div className="text-center mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-4xl">🧘</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Sessão de Meditação</h3>
        <p className="text-gray-600">Relaxe e respire profundamente</p>
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
      
      <div className="flex justify-center gap-4">
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
      
      <div className="mt-6 flex justify-between">
        <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90">
          Pausar
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
          Finalizar
        </button>
      </div>
    </div>
  );
}; 