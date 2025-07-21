import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSelector } from './UserSelector';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Settings } from 'lucide-react';

interface SessionForm {
  title: string;
  description: string;
  content: string;
  category: string;
  available_tools: string[];
  assigned_to: string[];
  scheduled_date: string;
  estimated_time: number;
  send_type: 'immediate' | 'scheduled';
  is_public: boolean;
  video_url?: string;
  pdf_url?: string;
}

const wheelTools = [
  { id: 'energia_vital', name: 'Roda da Energia Vital', description: 'Avalie seu equilíbrio energético' },
  { id: 'roda_vida', name: 'Roda da Vida', description: 'Analise os 5 pilares da sua vida' },
  { id: 'saude_energia', name: 'Roda da Saúde e Energia', description: 'Diagnóstico completo dos hábitos' },
  { id: 'gratidao_proposito', name: 'Roda de Gratidão e Propósito', description: 'Explore gratidão e propósito' }
];

export const SessionManagement: React.FC = () => {
  const [form, setForm] = useState<SessionForm>({
    title: '',
    description: '',
    content: '',
    category: 'personal',
    available_tools: ['energia_vital'],
    assigned_to: [],
    scheduled_date: '',
    estimated_time: 30,
    send_type: 'immediate',
    is_public: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToolToggle = (toolId: string) => {
    setForm(prev => ({
      ...prev,
      available_tools: prev.available_tools.includes(toolId)
        ? prev.available_tools.filter(id => id !== toolId)
        : [...prev.available_tools, toolId]
    }));
  };

  const handleUserSelection = (userIds: string[]) => {
    setForm(prev => ({ ...prev, assigned_to: userIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (form.assigned_to.length === 0 && !form.is_public) {
      toast.error('Selecione pelo menos um usuário ou marque como público');
      return;
    }

    if (form.available_tools.length === 0) {
      toast.error('Selecione pelo menos uma ferramenta');
      return;
    }

    setIsLoading(true);

    try {
      // Se for para usuários específicos, criar uma sessão para cada um
      if (form.assigned_to.length > 0) {
        for (const userId of form.assigned_to) {
          const { error } = await supabase.from('sessions').insert({
            title: form.title,
            description: form.description,
            content: form.content,
            category: form.category,
            available_tools: form.available_tools,
            assigned_to: userId,
            scheduled_date: form.scheduled_date || null,
            estimated_time: form.estimated_time,
            send_type: form.send_type,
            is_public: false,
            video_url: form.video_url || null,
            pdf_url: form.pdf_url || null
          });

          if (error) throw error;
        }
      } else {
        // Sessão pública
        const { error } = await supabase.from('sessions').insert({
          title: form.title,
          description: form.description,
          content: form.content,
          category: form.category,
          available_tools: form.available_tools,
          assigned_to: null,
          scheduled_date: form.scheduled_date || null,
          estimated_time: form.estimated_time,
          send_type: form.send_type,
          is_public: true,
          video_url: form.video_url || null,
          pdf_url: form.pdf_url || null
        });

        if (error) throw error;
      }

      toast.success('Sessão criada com sucesso!');
      
      // Reset form
      setForm({
        title: '',
        description: '',
        content: '',
        category: 'personal',
        available_tools: ['energia_vital'],
        assigned_to: [],
        scheduled_date: '',
        estimated_time: 30,
        send_type: 'immediate',
        is_public: false,
        video_url: '',
        pdf_url: ''
      });

    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      toast.error('Erro ao criar sessão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Criar Sessão Personalizada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="tools">Ferramentas</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nome da sessão"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Desenvolvimento Pessoal</SelectItem>
                      <SelectItem value="health">Saúde e Bem-estar</SelectItem>
                      <SelectItem value="therapy">Terapia</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da sessão..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo/Instruções</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Instruções detalhadas para o cliente..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_time">Tempo Estimado (min)</Label>
                  <Input
                    id="estimated_time"
                    type="number"
                    value={form.estimated_time}
                    onChange={(e) => setForm(prev => ({ ...prev, estimated_time: parseInt(e.target.value) || 30 }))}
                    min="5"
                    max="180"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="send_type">Tipo de Envio</Label>
                  <Select value={form.send_type} onValueChange={(value: 'immediate' | 'scheduled') => setForm(prev => ({ ...prev, send_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Imediato</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.send_type === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_date">Data Agendada</Label>
                    <Input
                      id="scheduled_date"
                      type="datetime-local"
                      value={form.scheduled_date}
                      onChange={(e) => setForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">URL do Vídeo (opcional)</Label>
                  <Input
                    id="video_url"
                    value={form.video_url}
                    onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf_url">URL do PDF (opcional)</Label>
                  <Input
                    id="pdf_url"
                    value={form.pdf_url}
                    onChange={(e) => setForm(prev => ({ ...prev, pdf_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <div>
                <Label className="text-base font-medium">Ferramentas Disponíveis *</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione as ferramentas que estarão disponíveis nesta sessão
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wheelTools.map((tool) => (
                    <div key={tool.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id={tool.id}
                        checked={form.available_tools.includes(tool.id)}
                        onCheckedChange={() => handleToolToggle(tool.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={tool.id} className="font-medium cursor-pointer">
                          {tool.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_public"
                    checked={form.is_public}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_public: !!checked, assigned_to: checked ? [] : prev.assigned_to }))}
                  />
                  <Label htmlFor="is_public">Sessão Pública (todos os usuários)</Label>
                </div>

                {!form.is_public && (
                  <div>
                    <Label className="text-base font-medium">Selecionar Usuários *</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Escolha os usuários que receberão esta sessão
                    </p>
                    <UserSelector
                      selectedUsers={form.assigned_to}
                      onSelectionChange={handleUserSelection}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading ? 'Criando...' : 'Criar Sessão'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};