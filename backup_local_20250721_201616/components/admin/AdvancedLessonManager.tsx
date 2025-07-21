import React, { useState } from 'react';
import { Plus, Upload, Link, Video, FileText, Image, Clock, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CourseModule } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

interface AdvancedLessonManagerProps {
  moduleId: string;
  module: CourseModule;
  onLessonAdded?: () => void;
}

export const AdvancedLessonManager: React.FC<AdvancedLessonManagerProps> = ({
  moduleId,
  module,
  onLessonAdded
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonType, setLessonType] = useState<'video' | 'text' | 'mixed'>('video');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    content_text: '',
    duration_minutes: 0,
    order_index: module.lessons?.length || 0,
    is_active: true,
    document_url: '',
    image_url: '',
    // Advanced fields
    thumbnail_url: '',
    quiz_questions: '',
    resources: '',
    prerequisites: '',
    learning_objectives: '',
    tags: ''
  });

  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileUpload = async (file: File, type: 'document' | 'image' | 'thumbnail') => {
    try {
      setUploadingFile(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `lessons/${type}s/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('course-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-assets')
        .getPublicUrl(filePath);

      switch (type) {
        case 'document':
          setFormData(prev => ({ ...prev, document_url: publicUrl }));
          break;
        case 'image':
          setFormData(prev => ({ ...prev, image_url: publicUrl }));
          break;
        case 'thumbnail':
          setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
          break;
      }

      toast({
        title: "Sucesso!",
        description: `${type === 'document' ? 'Documento' : type === 'image' ? 'Imagem' : 'Thumbnail'} enviado com sucesso`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar arquivo",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (lessonType === 'video' && !formData.video_url) {
      toast({
        title: "Erro",
        description: "URL do vídeo é obrigatória para aulas em vídeo",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const lessonData = {
        module_id: moduleId,
        title: formData.title,
        description: formData.description || null,
        video_url: lessonType !== 'text' ? formData.video_url : null,
        content_text: lessonType !== 'video' ? formData.content_text : null,
        duration_minutes: formData.duration_minutes || 0,
        order_index: formData.order_index,
        is_active: formData.is_active,
        document_url: formData.document_url || null,
        image_url: formData.image_url || null,
        // Store advanced fields in metadata or custom columns if available
        metadata: {
          thumbnail_url: formData.thumbnail_url,
          quiz_questions: formData.quiz_questions,
          resources: formData.resources,
          prerequisites: formData.prerequisites,
          learning_objectives: formData.learning_objectives,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }
      };

      const { error } = await supabase
        .from('course_lessons')
        .insert([lessonData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Aula criada com sucesso",
      });

      setIsOpen(false);
      if (onLessonAdded) {
        onLessonAdded();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar aula",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Aula Avançada
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Aula</DialogTitle>
          <DialogDescription>
            Configure todos os detalhes da nova aula para o módulo "{module.title}"
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label>Tipo de Aula</Label>
              <Select value={lessonType} onValueChange={(value: any) => setLessonType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Vídeo
                    </div>
                  </SelectItem>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Texto
                    </div>
                  </SelectItem>
                  <SelectItem value="mixed">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Misto
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Introdução ao Módulo"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o conteúdo desta aula"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duração (minutos)</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Aula Ativa</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            {(lessonType === 'video' || lessonType === 'mixed') && (
              <div>
                <Label>URL do Vídeo</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Suporta YouTube, Vimeo, ou links diretos para vídeos
                </p>
              </div>
            )}

            {(lessonType === 'text' || lessonType === 'mixed') && (
              <div>
                <Label>Conteúdo em Texto</Label>
                <Textarea
                  value={formData.content_text}
                  onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                  placeholder="Digite o conteúdo da aula em texto..."
                  rows={8}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thumbnail</CardTitle>
                <CardDescription>Imagem de capa da aula</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'thumbnail');
                    }}
                    disabled={uploadingFile}
                  />
                  {formData.thumbnail_url && (
                    <img src={formData.thumbnail_url} alt="Thumbnail" className="h-16 w-16 object-cover rounded" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documento de Apoio</CardTitle>
                <CardDescription>PDF, DOC ou outros documentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'document');
                    }}
                    disabled={uploadingFile}
                  />
                  {formData.document_url && (
                    <a href={formData.document_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Ver documento
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Imagem Ilustrativa</CardTitle>
                <CardDescription>Imagem para complementar o conteúdo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'image');
                    }}
                    disabled={uploadingFile}
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Imagem" className="h-16 w-16 object-cover rounded" />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label>Objetivos de Aprendizagem</Label>
              <Textarea
                value={formData.learning_objectives}
                onChange={(e) => setFormData({ ...formData, learning_objectives: e.target.value })}
                placeholder="O que o aluno aprenderá nesta aula..."
                rows={3}
              />
            </div>

            <div>
              <Label>Pré-requisitos</Label>
              <Input
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                placeholder="Conhecimentos necessários para esta aula"
              />
            </div>

            <div>
              <Label>Recursos Adicionais</Label>
              <Textarea
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                placeholder="Links, referências, materiais complementares..."
                rows={3}
              />
            </div>

            <div>
              <Label>Questões do Quiz (JSON)</Label>
              <Textarea
                value={formData.quiz_questions}
                onChange={(e) => setFormData({ ...formData, quiz_questions: e.target.value })}
                placeholder='[{"question": "...", "options": [...], "correct": 0}]'
                rows={4}
              />
            </div>

            <div>
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.title}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Aula'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 