import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  FileText, 
  Clock, 
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import type { CoachingTool } from '@/types/sessions';

// Criar cliente Supabase com service_role para contornar RLS
const supabaseAdmin = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

interface Question {
  number: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text';
  category: string;
  min?: number;
  max?: number;
  options?: string[];
}

interface ToolFormData {
  name: string;
  description: string;
  category: string;
  estimated_time: number;
  questions: Question[];
  scoring_config: any;
}

export const ToolManager = () => {
  const [tools, setTools] = useState<CoachingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para criar/editar ferramenta
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<CoachingTool | null>(null);
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    category: '',
    estimated_time: 15,
    questions: [],
    scoring_config: {}
  });

  // Carregar ferramentas
  const loadTools = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando ferramentas...');
      
      const { data, error } = await supabaseAdmin
        .from('coaching_tools')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Erro ao carregar ferramentas:', error);
        throw error;
      }
      
      console.log('✅ Ferramentas carregadas:', data);
      setTools(data || []);
    } catch (err) {
      console.error('❌ Erro ao carregar ferramentas:', err);
      setError('Erro ao carregar ferramentas');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova ferramenta
  const handleCreateTool = async () => {
    try {
      const { error } = await supabaseAdmin
        .from('coaching_tools')
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          total_questions: formData.questions.length,
          estimated_time: formData.estimated_time,
          question_data: formData.questions,
          scoring_config: formData.scoring_config,
          is_active: true
        });

      if (error) throw error;
      
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        estimated_time: 15,
        questions: [],
        scoring_config: {}
      });
      await loadTools();
    } catch (err) {
      console.error('Erro ao criar ferramenta:', err);
      setError('Erro ao criar ferramenta');
    }
  };

  // Editar ferramenta
  const handleEditTool = async () => {
    if (!editingTool) return;

    try {
      const { error } = await supabaseAdmin
        .from('coaching_tools')
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          total_questions: formData.questions.length,
          estimated_time: formData.estimated_time,
          question_data: formData.questions,
          scoring_config: formData.scoring_config
        })
        .eq('id', editingTool.id);

      if (error) throw error;
      
      setIsEditModalOpen(false);
      setEditingTool(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        estimated_time: 15,
        questions: [],
        scoring_config: {}
      });
      await loadTools();
    } catch (err) {
      console.error('Erro ao editar ferramenta:', err);
      setError('Erro ao editar ferramenta');
    }
  };

  // Deletar ferramenta
  const handleDeleteTool = async (toolId: number) => {
    try {
      const { error } = await supabaseAdmin
        .from('coaching_tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;
      await loadTools();
    } catch (err) {
      console.error('Erro ao deletar ferramenta:', err);
      setError('Erro ao deletar ferramenta');
    }
  };

  // Abrir modal de edição
  const openEditModal = (tool: CoachingTool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || '',
      category: tool.category || '',
      estimated_time: tool.estimated_time || 15,
      questions: tool.question_data || [],
      scoring_config: tool.scoring_config || {}
    });
    setIsEditModalOpen(true);
  };

  // Adicionar pergunta
  const addQuestion = () => {
    const newQuestion: Question = {
      number: formData.questions.length + 1,
      text: '',
      type: 'scale',
      category: '',
      min: 1,
      max: 10
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  // Remover pergunta
  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: newQuestions.map((q, i) => ({ ...q, number: i + 1 }))
    });
  };

  // Atualizar pergunta
  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  useEffect(() => {
    loadTools();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Carregando ferramentas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Ferramentas de Coaching</h2>
          <p className="text-muted-foreground">
            Crie e edite ferramentas de coaching com perguntas personalizadas
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Ferramenta</DialogTitle>
              <DialogDescription>
                Crie uma nova ferramenta de coaching com perguntas personalizadas
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList>
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
                <TabsTrigger value="scoring">Configuração de Pontuação</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Ferramenta</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Roda da Saúde Galileu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva o objetivo desta ferramenta"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: Saúde, Bem-estar"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Tempo Estimado (minutos)</Label>
                      <Input
                        id="time"
                        type="number"
                        value={formData.estimated_time}
                        onChange={(e) => setFormData({ ...formData, estimated_time: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Perguntas ({formData.questions.length})</h3>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pergunta
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Pergunta {question.number}</h4>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Texto da Pergunta</Label>
                          <Textarea
                            value={question.text}
                            onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                            placeholder="Digite a pergunta..."
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Tipo</Label>
                            <Select
                              value={question.type}
                              onValueChange={(value) => updateQuestion(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scale">Escala</SelectItem>
                                <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                                <SelectItem value="text">Texto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Categoria</Label>
                            <Input
                              value={question.category}
                              onChange={(e) => updateQuestion(index, 'category', e.target.value)}
                              placeholder="Ex: Emocional"
                            />
                          </div>
                          {question.type === 'scale' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label>Mín</Label>
                                <Input
                                  type="number"
                                  value={question.min}
                                  onChange={(e) => updateQuestion(index, 'min', parseInt(e.target.value))}
                                />
                              </div>
                              <div>
                                <Label>Máx</Label>
                                <Input
                                  type="number"
                                  value={question.max}
                                  onChange={(e) => updateQuestion(index, 'max', parseInt(e.target.value))}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="scoring" className="space-y-4">
                <div>
                  <Label>Configuração de Pontuação (JSON)</Label>
                  <Textarea
                    value={JSON.stringify(formData.scoring_config, null, 2)}
                    onChange={(e) => {
                      try {
                        const config = JSON.parse(e.target.value);
                        setFormData({ ...formData, scoring_config: config });
                      } catch (err) {
                        // Ignora erros de JSON inválido
                      }
                    }}
                    placeholder='{"categories": ["Emocional", "Fisiológico"], "max_score": 10}'
                    rows={10}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTool} disabled={!formData.name || formData.questions.length === 0}>
                Criar Ferramenta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de ferramentas */}
      <div className="grid gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{tool.name}</h3>
                    <Badge variant="outline">{tool.category}</Badge>
                    <Badge variant="secondary">{tool.total_questions} perguntas</Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{tool.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {tool.estimated_time} min
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {tool.total_questions} perguntas
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Ativa
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(tool)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a ferramenta "{tool.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTool(tool.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ferramenta</DialogTitle>
            <DialogDescription>
              Edite as informações e perguntas da ferramenta
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="questions">Perguntas</TabsTrigger>
              <TabsTrigger value="scoring">Configuração de Pontuação</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome da Ferramenta</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Input
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-time">Tempo Estimado (minutos)</Label>
                    <Input
                      id="edit-time"
                      type="number"
                      value={formData.estimated_time}
                      onChange={(e) => setFormData({ ...formData, estimated_time: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Perguntas ({formData.questions.length})</h3>
                <Button onClick={addQuestion} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Pergunta {question.number}</h4>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Texto da Pergunta</Label>
                        <Textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Tipo</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuestion(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scale">Escala</SelectItem>
                              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                              <SelectItem value="text">Texto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Categoria</Label>
                          <Input
                            value={question.category}
                            onChange={(e) => updateQuestion(index, 'category', e.target.value)}
                          />
                        </div>
                        {question.type === 'scale' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Mín</Label>
                              <Input
                                type="number"
                                value={question.min}
                                onChange={(e) => updateQuestion(index, 'min', parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label>Máx</Label>
                              <Input
                                type="number"
                                value={question.max}
                                onChange={(e) => updateQuestion(index, 'max', parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scoring" className="space-y-4">
              <div>
                <Label>Configuração de Pontuação (JSON)</Label>
                <Textarea
                  value={JSON.stringify(formData.scoring_config, null, 2)}
                  onChange={(e) => {
                    try {
                      const config = JSON.parse(e.target.value);
                      setFormData({ ...formData, scoring_config: config });
                    } catch (err) {
                      // Ignora erros de JSON inválido
                    }
                  }}
                  rows={10}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTool} disabled={!formData.name || formData.questions.length === 0}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 