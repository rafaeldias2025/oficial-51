import React, { useState } from 'react';
import KwifyVideoPlayer from './KwifyVideoPlayer';

export const KwifyStyle: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<{url: string, title: string} | null>(null);
  // Dados das categorias e cursos
  const categorias = [
    {
      id: 'jornada-15',
      titulo: 'Jornada 15 Dias',
      cursos: [
        { 
          id: '01', 
          numero: '01', 
          titulo: 'Boas Vindas'
        },
        { 
          id: '02', 
          numero: '02', 
          titulo: 'Dia 2'
        },
        { 
          id: '03', 
          numero: '03', 
          titulo: 'Dia 3'
        },
        { 
          id: '04', 
          numero: '04', 
          titulo: 'Respiração Guiada'
        },
        { 
          id: '05', 
          numero: '05', 
          titulo: 'Dia 5'
        },
        { 
          id: '06', 
          numero: '06', 
          titulo: 'Alimentos Fitness'
        }
      ]
    },
    {
      id: 'jornada-7',
      titulo: 'Jornada 7 Dias',
      cursos: [
        { 
          id: '01', 
          numero: '01', 
          titulo: 'Boas Vindas'
        },
        { 
          id: '02', 
          numero: '02', 
          titulo: 'Qual sua Motivação?'
        },
        { 
          id: '03', 
          numero: '03', 
          titulo: 'Diário do Dia a Dia'
        },
        { 
          id: '04', 
          numero: '04', 
          titulo: 'Conhecimento é Poder'
        },
        { 
          id: '05', 
          numero: '05', 
          titulo: 'A Água é sua Amiga'
        },
        { 
          id: '06', 
          numero: '06', 
          titulo: 'Alimentação Fitness'
        }
      ]
    },
    {
      id: 'plataforma-sonhos',
      titulo: 'Plataforma Dos Sonhos',
      cursos: [
        { 
          id: '01', 
          numero: '01', 
          titulo: '7 CHAVES'
        },
        { 
          id: '02', 
          numero: '02', 
          titulo: '12 CHÁS'
        },
        { 
          id: '03', 
          numero: '03', 
          titulo: 'PÍLULAS DO BEM'
        },
        { 
          id: '04', 
          numero: '04', 
          titulo: 'JEJUM INTERMITENTE'
        },
        { 
          id: '05', 
          numero: '05', 
          titulo: 'Dia a Dia'
        }
      ]
    }
  ];

  const handleAssistir = (cursoId: string, categoriaId: string, titulo: string) => {
    console.log(`Assistindo curso ${cursoId} da categoria ${categoriaId}`);
    
    // URLs dos vídeos do YouTube baseadas nos IDs encontrados na Kiwify
    const videoUrls: {[key: string]: string} = {
      '01': 'https://www.youtube.com/embed/7P94W09w2T0?autoplay=1&mute=1&enablejsapi=1', // Seja Bem Vindo
      '02': 'https://www.youtube.com/embed/7P94W09w2T0?autoplay=1&mute=1&enablejsapi=1', // Placeholder - usando o mesmo vídeo
      '03': 'https://www.youtube.com/embed/7P94W09w2T0?autoplay=1&mute=1&enablejsapi=1', // Placeholder - usando o mesmo vídeo
      '04': 'https://www.youtube.com/embed/7P94W09w2T0?autoplay=1&mute=1&enablejsapi=1', // Placeholder - usando o mesmo vídeo
      '05': 'https://www.youtube.com/embed/7P94W09w2T0?autoplay=1&mute=1&enablejsapi=1', // Placeholder - usando o mesmo vídeo
      '06': 'https://www.youtube.com/embed/7P94W09w2T0?autoplay=1&mute=1&enablejsapi=1', // Placeholder - usando o mesmo vídeo
    };
    
    const videoUrl = videoUrls[cursoId] || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    setSelectedVideo({ url: videoUrl, title: titulo });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Título principal */}
      <div className="w-full py-16 mb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
          NOVO CONTEÚDO
        </h1>
        <h2 className="text-6xl md:text-7xl font-bold text-white">
          MENSALMENTE
        </h2>
      </div>

      {/* Categorias e cursos */}
      {categorias.map((categoria) => (
        <div key={categoria.id} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{categoria.titulo}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoria.cursos.map((curso) => (
              <div key={`${categoria.id}-${curso.id}`} className="flex flex-col">
                {/* Número grande */}
                <div className="mb-2 text-center">
                  <span className="text-6xl md:text-7xl font-bold text-white">
                    {curso.numero}
                  </span>
                </div>
                
                {/* Título */}
                <div className="text-center mb-2">
                  <h3 className="text-sm font-bold">{curso.titulo}</h3>
                </div>
                
                                            {/* Botão Assistir */}
                            <div className="text-center">
                              <button 
                                onClick={() => handleAssistir(curso.id, categoria.id, curso.titulo)}
                                className="text-xs bg-transparent border border-red-600 text-white px-3 py-1 rounded hover:bg-red-600/20 transition-colors"
                              >
                                Assistir
                              </button>
                            </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-600">
        <p>Plataforma dos Sonhos • powered by Kwify</p>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <KwifyVideoPlayer
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default KwifyStyle; 