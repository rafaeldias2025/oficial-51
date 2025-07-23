import React, { useState } from 'react';
import { X, Play, Star, Users, Clock, BookOpen, Heart, Target, Zap } from 'lucide-react';

interface ModalDesenhadoProps {
  isOpen: boolean;
  onClose: () => void;
  curso?: {
    id: string;
    titulo: string;
    descricao: string;
    duracao: string;
    alunos: number;
    avaliacao: number;
    categoria: string;
    imagem: string;
  };
}

export default function ModalDesenhado({ isOpen, onClose, curso }: ModalDesenhadoProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComecarCurso = async () => {
    setIsLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com gradiente */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-red-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Principal */}
      <div className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        
        {/* Header do Modal */}
        <div className="relative h-64 bg-gradient-to-r from-purple-600 via-blue-600 to-red-600 overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-red-500/20" />
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
          >
            <X size={20} />
          </button>
          
          {/* Conteúdo do header */}
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {curso?.categoria || 'Nutrição'}
                </span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-2">
              {curso?.titulo || 'Fundamentos da Nutrição Saudável'}
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl">
              {curso?.descricao || 'Descubra os princípios fundamentais da nutrição e aprenda a criar hábitos alimentares saudáveis que transformarão sua vida.'}
            </p>
          </div>
        </div>
        
        {/* Conteúdo do Modal */}
        <div className="p-8">
          {/* Estatísticas do curso */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-purple-400" size={20} />
                <span className="text-sm font-medium text-gray-300">Duração</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {curso?.duracao || '8 semanas'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-blue-400" size={20} />
                <span className="text-sm font-medium text-gray-300">Alunos</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {curso?.alunos || '1.247'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-2xl p-6 border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Star className="text-yellow-400" size={20} />
                <span className="text-sm font-medium text-gray-300">Avaliação</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {curso?.avaliacao || '4.8'}/5
              </p>
            </div>
          </div>
          
          {/* O que você vai aprender */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="text-green-400" size={20} />
              O que você vai aprender
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Princípios fundamentais da nutrição',
                'Como criar um plano alimentar personalizado',
                'Identificar alimentos saudáveis',
                'Hábitos alimentares sustentáveis',
                'Receitas nutritivas e saborosas',
                'Como manter a motivação'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Benefícios */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              Benefícios do curso
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                <Heart className="text-green-400 mb-2" size={24} />
                <h4 className="font-semibold text-white mb-1">Saúde Melhorada</h4>
                <p className="text-sm text-gray-400">Transforme sua saúde através da alimentação</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                <Target className="text-blue-400 mb-2" size={24} />
                <h4 className="font-semibold text-white mb-1">Metas Alcançadas</h4>
                <p className="text-sm text-gray-400">Atinga seus objetivos de forma sustentável</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                <BookOpen className="text-purple-400 mb-2" size={24} />
                <h4 className="font-semibold text-white mb-1">Conhecimento</h4>
                <p className="text-sm text-gray-400">Aprenda com especialistas certificados</p>
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleComecarCurso}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Começar Curso Agora
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="px-8 py-4 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-2xl transition-all duration-300 font-medium"
            >
              Ver mais detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 