import React, { useState } from 'react';
import { X, Video, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernVideoPlayer } from './ModernVideoPlayer';

interface NetflixStylePlayerProps {
  videoUrl: string;
  title: string;
  description: string;
  onClose: () => void;
  lessons: Array<{
    id: string;
    title: string;
    duration: string;
    status: 'watching' | 'not-watched' | 'completed';
  }>;
}

export const NetflixStylePlayer: React.FC<NetflixStylePlayerProps> = ({
  videoUrl,
  title,
  description,
  onClose,
  lessons
}) => {
  const [currentLesson, setCurrentLesson] = useState(0);

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Área Principal do Vídeo (70% da tela) */}
      <div className="flex-1 relative">
        <ModernVideoPlayer
          videoUrl={videoUrl}
          title={title}
          onEnded={() => console.log('Vídeo terminou')}
          onTimeUpdate={(currentTime, duration) => console.log('Tempo:', currentTime, duration)}
        />
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Informações do Vídeo na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="max-w-4xl">
            <h3 className="text-white text-2xl font-bold mb-2">
              {lessons[currentLesson]?.title || 'Aula 1 - Respiração e Ansiedade'}
            </h3>
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <div className="text-white text-sm">
                Duração: {lessons[currentLesson]?.duration || '15:30'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar com Aulas (30% da tela) */}
      <div className="w-[400px] bg-gray-900 border-l border-gray-700 overflow-y-auto">
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>

        {/* Lista de Aulas */}
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-4">Aulas do Curso</h4>
          
          {/* Aulas */}
          {lessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              className={`mb-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                index === currentLesson 
                  ? 'bg-brand-500 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setCurrentLesson(index)}
            >
              <div className="flex items-center space-x-3">
                {/* Thumbnail da Aula */}
                <div className="w-16 h-12 bg-gray-600 rounded flex items-center justify-center">
                  <Video className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Info da Aula */}
                <div className="flex-1">
                  <h5 className="font-medium">
                    {lesson.title}
                  </h5>
                  <p className="text-sm opacity-75">
                    {lesson.duration} • {
                      lesson.status === 'watching' ? 'Assistindo' : 
                      lesson.status === 'completed' ? 'Concluída' : 'Não assistida'
                    }
                  </p>
                </div>
                
                {/* Status */}
                <div className="text-right">
                  {lesson.status === 'watching' ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : lesson.status === 'completed' ? (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações do Curso */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progresso</span>
              <span className="text-white">25%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-brand-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="text-xs text-gray-500">
              1 de {lessons.length} aulas concluídas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 