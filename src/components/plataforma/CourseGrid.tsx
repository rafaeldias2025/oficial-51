import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, BookOpen, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NetflixStylePlayer } from '@/components/player/NetflixStylePlayer';

// Estrutura de módulos e cursos
const modulesData = [
  {
    id: 'modulo-1',
    title: 'MÓDULO 1: FUNDAMENTOS',
    type: 'MÓDULO' as const,
    imageUrl: '/src/assets/butterfly-logo.png',
    courses: [
      {
        id: '1',
        title: '7 CHAVES',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: '7 chaves que me ajudam no dia a dia'
      },
      {
        id: '2',
        title: '12 CHÁS',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Aceita uma xícara?'
      },
      {
        id: '3',
        title: 'PÍLULAS DO BEM',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Pílulas para o dia a dia'
      }
    ]
  },
  {
    id: 'modulo-2',
    title: 'MÓDULO 2: NUTRIÇÃO',
    type: 'MÓDULO' as const,
    imageUrl: '/src/assets/butterfly-logo.png',
    courses: [
      {
        id: '4',
        title: 'JEJUM INTERMITENTE',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Método de jejum intermitente'
      },
      {
        id: '5',
        title: 'DIA A DIA',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Ritual diário de transformação'
      },
      {
        id: '11',
        title: 'DOCES KIDS!',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Doces saudáveis para crianças'
      },
      {
        id: '12',
        title: 'ZERO LACTOSE',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Receitas sem lactose'
      },
      {
        id: '13',
        title: 'DIABÉTICOS',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Receitas para diabéticos'
      },
      {
        id: '14',
        title: 'LOW CARB',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Receitas low carb'
      },
      {
        id: '15',
        title: 'ZERO GLÚTEN',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Receitas sem glúten'
      }
    ]
  },
  {
    id: 'modulo-3',
    title: 'MÓDULO 3: FITNESS',
    type: 'MÓDULO' as const,
    imageUrl: '/src/assets/butterfly-logo.png',
    courses: [
      {
        id: '6',
        title: 'MEMBROS SUPERIORES',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Treine sem membros superiores'
      },
      {
        id: '7',
        title: 'TREINO PARA GESTANTES',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Treino especializado para gestantes'
      },
      {
        id: '8',
        title: 'PERNAS DEFINIDAS',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Defina suas pernas com exercícios específicos'
      },
      {
        id: '9',
        title: 'TREINO DE MOBILIDADE',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Melhore sua mobilidade e flexibilidade'
      },
      {
        id: '10',
        title: 'BUM BUM NA NUCA',
        type: 'CURSO' as const,
        imageUrl: '/src/assets/butterfly-logo.png',
        description: 'Exercícios específicos para glúteos'
      }
    ]
  }
];

export const CourseGrid = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [contentType, setContentType] = useState<'modulo' | 'curso'>('curso');
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    moduleId: '',
    imageUrl: '/src/assets/butterfly-logo.png'
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      dragStartPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && bannerRef.current) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      setBannerPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você pode adicionar a lógica para salvar no banco de dados
    console.log('Adicionando conteúdo:', {
      type: contentType,
      ...formData
    });
    
    // Limpar formulário
    setFormData({
      title: '',
      description: '',
      moduleId: '',
      imageUrl: '/src/assets/butterfly-logo.png'
    });
    
    // Fechar modal
    setShowAddModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Dados das aulas para o player
  const lessonsData = [
    {
      id: '1',
      title: 'Aula 1 - Respiração e Ansiedade',
      duration: '15:30',
      status: 'watching' as const
    },
    {
      id: '2',
      title: 'Aula 2 - Técnicas de Relaxamento',
      duration: '18:45',
      status: 'not-watched' as const
    },
    {
      id: '3',
      title: 'Aula 3 - Meditação Guiada',
      duration: '22:15',
      status: 'not-watched' as const
    },
    {
      id: '4',
      title: 'Aula 4 - Práticas Diárias',
      duration: '20:00',
      status: 'not-watched' as const
    }
  ];

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setShowVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setSelectedCourse(null);
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Capa Promocional - Banner Top 100% */}
      <div 
        ref={bannerRef}
        className="absolute cursor-move w-full h-[640px] gradient-netflix"
        style={{
          left: `${bannerPosition.x}px`,
          top: `${bannerPosition.y}px`,
          userSelect: 'none',
          maxWidth: '100%',
          maxHeight: '100vh'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            {/* Logo Borboleta */}
            <div className="mb-20">
              <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Texto Central */}
            <div className="space-y-2 mb-16">
              <h2 className="text-[5.5rem] font-bold text-foreground drop-shadow-lg tracking-wide">
                NOVO CONTEÚDO
              </h2>
              <h3 className="text-[5.5rem] font-bold text-foreground drop-shadow-lg tracking-wide">
                MENSALMENTE
              </h3>
            </div>
            
            {/* Botão */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-xl text-2xl font-semibold transition-all duration-300">
              Acessar Conteúdo
            </Button>
          </div>
        </div>
      </div>

      {/* Espaçador para o conteúdo não ficar sob o banner */}
      <div className="h-[640px]"></div>

      {/* Módulos com capas ajustadas */}
      <div className="mt-16">
        {modulesData.map((module, moduleIndex) => (
          <div key={moduleIndex} className="space-y-8 mb-12">
            {/* Cabeçalho do módulo - Compacto */}
            <div className="flex items-center gap-3 py-4 px-4 bg-card rounded-lg border border-border">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">M</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">
                {module.title}
              </h3>
              <span className="text-sm text-muted-foreground ml-auto">
                {module.courses.length} cursos
              </span>
            </div>

            {/* Grid de cursos com capas ajustadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {module.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="group">
                  {/* Capa do curso - Dimensões exatas */}
                  <div className="relative w-[320px] h-[480px] rounded-lg overflow-hidden gradient-primary shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-primary/20 mx-auto">
                    {/* Confetti decorativo */}
                    <div className="absolute inset-0">
                      <div className="absolute top-4 left-4 w-2 h-2 bg-warning rounded-full"></div>
                      <div className="absolute top-8 right-6 w-1 h-1 bg-accent rounded-full"></div>
                      <div className="absolute top-12 left-8 w-1.5 h-1.5 bg-warning rounded-full"></div>
                      <div className="absolute top-16 right-4 w-1 h-1 bg-primary rounded-full"></div>
                      <div className="absolute top-20 left-12 w-1 h-1 bg-success rounded-full"></div>
                      <div className="absolute top-24 right-8 w-1.5 h-1.5 bg-accent rounded-full"></div>
                    </div>
                    
                    {/* Número do curso */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                      <div className="text-7xl font-bold text-primary-foreground drop-shadow-lg">
                        {String(courseIndex + 1).padStart(2, '0')}
                      </div>
                    </div>
                    
                    {/* Título do curso */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
                      <h4 className="text-2xl font-bold text-foreground mb-2">
                        {course.title}
                      </h4>
                      <p className="text-lg text-muted-foreground">
                        4 aulas
                      </p>
                    </div>
                  </div>
                  
                  {/* Botão de ação */}
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={() => handleCourseClick(course)}
                      className="bg-primary text-primary-foreground px-10 py-4 rounded-lg hover:bg-primary/90 transition-colors text-base font-semibold shadow-lg"
                    >
                      Assistir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Player Netflix Style */}
      {showVideoPlayer && selectedCourse && (
        <NetflixStylePlayer
          videoUrl="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
          title={selectedCourse.title}
          description={selectedCourse.description}
          onClose={handleCloseVideoPlayer}
          lessons={lessonsData}
        />
      )}

      {/* Botão Flutuante Adicionar */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-accent text-accent-foreground rounded-full p-3 shadow-lg hover:bg-accent/90 transition-colors z-50"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Modal Adicionar Conteúdo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border">
            {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Adicionar Conteúdo</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-card-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tipo de Conteúdo */}
              <div className="space-y-2">
                <Label htmlFor="contentType">Tipo de Conteúdo</Label>
                <Select value={contentType} onValueChange={(value: 'modulo' | 'curso') => setContentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modulo">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Módulo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="curso">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span>Curso</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={contentType === 'modulo' ? 'Ex: MÓDULO 4: ESPIRITUALIDADE' : 'Ex: MEDITAÇÃO DIÁRIA'}
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={contentType === 'modulo' ? 'Descrição do módulo...' : 'Descrição do curso...'}
                  rows={3}
                  required
                />
              </div>

              {/* Módulo (apenas para cursos) */}
              {contentType === 'curso' && (
                <div className="space-y-2">
                  <Label htmlFor="moduleId">Módulo</Label>
                  <Select value={formData.moduleId} onValueChange={(value) => handleInputChange('moduleId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modulesData.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* URL da Imagem */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="/src/assets/butterfly-logo.png"
                />
              </div>

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Adicionar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 