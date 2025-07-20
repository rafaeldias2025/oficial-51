import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Image as ImageIcon, Play, Pause } from 'lucide-react';
import { usePremiumCourses } from '@/hooks/usePremiumCourses';
import { HeroConfig } from '@/types/premium';

interface DynamicHeroProps {
  courseId: string;
  isAdmin?: boolean;
}

type HeroType = 'image' | 'video';

interface HeroFormData {
  hero_type: HeroType;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_video_url: string;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({ courseId, isAdmin = false }) => {
  const { getHeroConfig, updateHeroConfig } = usePremiumCourses();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState<HeroFormData>({
    hero_type: 'image',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    hero_video_url: ''
  });

  useEffect(() => {
    const loadConfig = async () => {
      const data = await getHeroConfig(courseId);
      if (data) {
        setConfig(data);
        setFormData({
          hero_type: data.hero_type,
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle || '',
          hero_image_url: data.hero_image_url || '',
          hero_video_url: data.hero_video_url || ''
        });
      }
      setLoading(false);
    };

    loadConfig();
  }, [courseId, getHeroConfig]);

  const handleSave = async () => {
    await updateHeroConfig(courseId, formData);
    setEditMode(false);
    const updatedConfig = await getHeroConfig(courseId);
    if (updatedConfig) {
      setConfig(updatedConfig);
    }
  };

  const handleInputChange = (field: keyof HeroFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlayback = () => {
    const video = document.querySelector<HTMLVideoElement>('#hero-video');
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-[400px] animate-pulse bg-muted">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (editMode && isAdmin) {
    return (
      <Card className="w-full p-6">
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Tipo de Hero</Label>
              <div className="flex items-center space-x-2">
                <Label>Imagem</Label>
                <Switch
                  checked={formData.hero_type === 'video'}
                  onCheckedChange={(checked) => handleInputChange('hero_type', checked ? 'video' : 'image')}
                />
                <Label>Vídeo</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={formData.hero_title}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="Digite o título do hero"
                />
              </div>

              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={formData.hero_subtitle}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  placeholder="Digite o subtítulo do hero"
                />
              </div>

              {formData.hero_type === 'image' ? (
                <div>
                  <Label>URL da Imagem</Label>
                  <Input
                    value={formData.hero_image_url}
                    onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                    placeholder="Digite a URL da imagem"
                  />
                </div>
              ) : (
                <div>
                  <Label>URL do Vídeo</Label>
                  <Input
                    value={formData.hero_video_url}
                    onChange={(e) => handleInputChange('hero_video_url', e.target.value)}
                    placeholder="Digite a URL do vídeo"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0 relative">
        {config?.hero_type === 'video' && config.hero_video_url ? (
          <div className="relative">
            <video
              id="hero-video"
              src={config.hero_video_url}
              className="w-full h-[400px] object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <img
            src={config?.hero_image_url || '/placeholder.svg'}
            alt={config?.hero_title}
            className="w-full h-[400px] object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 flex flex-col justify-end p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{config?.hero_title}</h1>
          {config?.hero_subtitle && (
            <p className="text-lg text-white/90">{config.hero_subtitle}</p>
          )}
        </div>

        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-background/80 hover:bg-background"
            onClick={() => setEditMode(true)}
          >
            Editar Hero
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 