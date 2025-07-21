import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, CheckCircle, Upload, Minimize, Calendar, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface JourneyItem {
  id: string;
  title: string;
  description: string;
  journeyId: string;
  order: number;
  isPublished: boolean;
  isCompleted: boolean;
  videoUrl?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Journey {
  id: string;
  title: string;
  description: string;
  duration: number; // dias
  isActive: boolean;
  itemCount: number;
  completedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface JourneyFormData {
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
}

interface JourneyItemFormData {
  title: string;
  description: string;
  journeyId: string;
  order: number;
  isPublished: boolean;
  videoUrl?: string;
  duration?: number;
}

export const JourneyManager: React.FC = () => {
  // Dados mockados para demonstração
  const [journeys, setJourneys] = useState<Journey[]>([
    {
      id: '1',
      title: 'Jornada 15 Dias',
      description: 'Transformação completa em 15 dias',
      duration: 15,
      isActive: true,
      itemCount: 7,
      completedCount: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Jornada 7D',
      description: 'Jornada rápida de 7 dias',
      duration: 7,
      isActive: true,
      itemCount: 7,
      completedCount: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([
    // Jornada 15 Dias
    {
      id: '1',
      title: 'Boas Vindas',
      description: 'Bem-vindo à sua jornada de transformação',
      journeyId: '1',
      order: 1,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video1.mp4',
      duration: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Quem Sou Eu',
      description: 'Descubra sua verdadeira identidade',
      journeyId: '1',
      order: 2,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video2.mp4',
      duration: 450,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Mapa',
      description: 'Crie seu mapa de objetivos',
      journeyId: '1',
      order: 3,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video3.mp4',
      duration: 600,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      title: 'Definindo Objetivo',
      description: 'Defina claramente seus objetivos',
      journeyId: '1',
      order: 4,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video4.mp4',
      duration: 400,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      title: 'Afirmação Positiva',
      description: 'Pratique afirmações positivas diariamente',
      journeyId: '1',
      order: 5,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video5.mp4',
      duration: 350,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      title: 'Celebrar',
      description: 'Celebre suas conquistas',
      journeyId: '1',
      order: 6,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video6.mp4',
      duration: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      title: 'Desinflame',
      description: 'Técnicas para reduzir inflamação',
      journeyId: '1',
      order: 7,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video7.mp4',
      duration: 500,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Jornada 7D
    {
      id: '8',
      title: 'Sejam Bem Vindos',
      description: 'Bem-vindos à jornada de 7 dias',
      journeyId: '2',
      order: 1,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video8.mp4',
      duration: 250,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      title: 'Qual seu Motivo?',
      description: 'Identifique seu motivo principal',
      journeyId: '2',
      order: 2,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video9.mp4',
      duration: 400,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      title: 'Dicas do Dia a Dia',
      description: 'Dicas práticas para o dia a dia',
      journeyId: '2',
      order: 3,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video10.mp4',
      duration: 350,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '11',
      title: 'Principios básicos',
      description: 'Aprenda os princípios fundamentais',
      journeyId: '2',
      order: 4,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video11.mp4',
      duration: 450,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      title: 'Consumo de água.',
      description: 'Importância da hidratação adequada',
      journeyId: '2',
      order: 5,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video12.mp4',
      duration: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '13',
      title: 'Atividade Física',
      description: 'Exercícios para manter-se ativo',
      journeyId: '2',
      order: 6,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video13.mp4',
      duration: 600,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '14',
      title: 'Temperos dos Sonhos',
      description: 'Temperos naturais para saúde',
      journeyId: '2',
      order: 7,
      isPublished: true,
      isCompleted: true,
      videoUrl: 'https://example.com/video14.mp4',
      duration: 400,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Estados do formulário
  const [isAddJourneyDialogOpen, setIsAddJourneyDialogOpen] = useState(false);
  const [isEditJourneyDialogOpen, setIsEditJourneyDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [editingItem, setEditingItem] = useState<JourneyItem | null>(null);
  const [expandedJourneys, setExpandedJourneys] = useState<Set<string>>(new Set(['1', '2']));
  
  const [journeyFormData, setJourneyFormData] = useState<JourneyFormData>({
    title: '',
    description: '',
    duration: 7,
    isActive: true
  });

  const [itemFormData, setItemFormData] = useState<JourneyItemFormData>({
    title: '',
    description: '',
    journeyId: '',
    order: 1,
    isPublished: true,
    videoUrl: '',
    duration: 300
  });

  const handleAddJourney = () => {
    setIsAddJourneyDialogOpen(true);
    setJourneyFormData({
      title: '',
      description: '',
      duration: 7,
      isActive: true
    });
  };

  const handleEditJourney = (journey: Journey) => {
    setEditingJourney(journey);
    setJourneyFormData({
      title: journey.title,
      description: journey.description,
      duration: journey.duration,
      isActive: journey.isActive
    });
    setIsEditJourneyDialogOpen(true);
  };

  const handleSaveJourney = () => {
    if (editingJourney) {
      // Editar jornada existente
      setJourneys(journeys.map(journey => 
        journey.id === editingJourney.id 
          ? { ...journey, ...journeyFormData, updatedAt: new Date() }
          : journey
      ));
      setIsEditJourneyDialogOpen(false);
      setEditingJourney(null);
    } else {
      // Adicionar nova jornada
      const newJourney: Journey = {
        id: Date.now().toString(),
        ...journeyFormData,
        itemCount: 0,
        completedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setJourneys([...journeys, newJourney]);
      setIsAddJourneyDialogOpen(false);
    }
    
    setJourneyFormData({
      title: '',
      description: '',
      duration: 7,
      isActive: true
    });
  };

  const handleAddItem = (journeyId: string) => {
    setItemFormData({
      title: '',
      description: '',
      journeyId: journeyId,
      order: getJourneyItems(journeyId).length + 1,
      isPublished: true,
      videoUrl: '',
      duration: 300
    });
    setIsAddItemDialogOpen(true);
  };

  const handleEditItem = (item: JourneyItem) => {
    setEditingItem(item);
    setItemFormData({
      title: item.title,
      description: item.description,
      journeyId: item.journeyId,
      order: item.order,
      isPublished: item.isPublished,
      videoUrl: item.videoUrl || '',
      duration: item.duration || 300
    });
    setIsEditItemDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      // Editar item existente
      setJourneyItems(journeyItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemFormData, updatedAt: new Date() }
          : item
      ));
      setIsEditItemDialogOpen(false);
      setEditingItem(null);
    } else {
      // Adicionar novo item
      const newItem: JourneyItem = {
        id: Date.now().toString(),
        ...itemFormData,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setJourneyItems([...journeyItems, newItem]);
      setIsAddItemDialogOpen(false);
    }
    
    setItemFormData({
      title: '',
      description: '',
      journeyId: '',
      order: 1,
      isPublished: true,
      videoUrl: '',
      duration: 300
    });
  };

  const handleDeleteJourney = (journeyId: string) => {
    setJourneys(journeys.filter(journey => journey.id !== journeyId));
    setJourneyItems(journeyItems.filter(item => item.journeyId !== journeyId));
  };

  const handleDeleteItem = (itemId: string) => {
    setJourneyItems(journeyItems.filter(item => item.id !== itemId));
  };

  const handleToggleJourneyActive = (journeyId: string) => {
    setJourneys(journeys.map(journey => 
      journey.id === journeyId 
        ? { ...journey, isActive: !journey.isActive, updatedAt: new Date() }
        : journey
    ));
  };

  const handleToggleItemPublished = (itemId: string) => {
    setJourneyItems(journeyItems.map(item => 
      item.id === itemId 
        ? { ...item, isPublished: !item.isPublished, updatedAt: new Date() }
        : item
    ));
  };

  const getJourneyItems = (journeyId: string) => {
    return journeyItems.filter(item => item.journeyId === journeyId).sort((a, b) => a.order - b.order);
  };

  const toggleJourneyExpanded = (journeyId: string) => {
    const newExpanded = new Set(expandedJourneys);
    if (newExpanded.has(journeyId)) {
      newExpanded.delete(journeyId);
    } else {
      newExpanded.add(journeyId);
    }
    setExpandedJourneys(newExpanded);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Desafios dos Sonhos</h2>
          <p className="text-gray-600">Gerencie suas jornadas e desafios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload de vídeos
          </Button>
          <Button variant="outline">
            <Minimize className="w-4 h-4 mr-2" />
            Minimizar
          </Button>
          <Dialog open={isAddJourneyDialogOpen} onOpenChange={setIsAddJourneyDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddJourney}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Jornada</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="journey-title">Título da Jornada</Label>
                  <Input
                    id="journey-title"
                    value={journeyFormData.title}
                    onChange={(e) => setJourneyFormData({...journeyFormData, title: e.target.value})}
                    placeholder="Ex: Jornada 15 Dias"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="journey-description">Descrição</Label>
                  <Textarea
                    id="journey-description"
                    value={journeyFormData.description}
                    onChange={(e) => setJourneyFormData({...journeyFormData, description: e.target.value})}
                    placeholder="Descreva a jornada"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="journey-duration">Duração (dias)</Label>
                  <Input
                    id="journey-duration"
                    type="number"
                    value={journeyFormData.duration}
                    onChange={(e) => setJourneyFormData({...journeyFormData, duration: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="journey-isActive"
                    checked={journeyFormData.isActive}
                    onCheckedChange={(checked) => setJourneyFormData({...journeyFormData, isActive: checked})}
                  />
                  <Label htmlFor="journey-isActive">Jornada Ativa</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddJourneyDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveJourney}>
                  Salvar Jornada
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Jornadas */}
      <div className="space-y-4">
        {journeys.map((journey) => {
          const items = getJourneyItems(journey.id);
          const isExpanded = expandedJourneys.has(journey.id);
          
          return (
            <Card key={journey.id} className="border-0 bg-gradient-to-br from-white to-gray-50/50">
              <Collapsible open={isExpanded} onOpenChange={() => toggleJourneyExpanded(journey.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg">{journey.title}</CardTitle>
                            <p className="text-sm text-gray-600">{journey.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{items.length} itens</div>
                          <div className="text-xs text-gray-500">{journey.duration} dias</div>
                        </div>
                        <Badge variant={journey.isActive ? "default" : "secondary"}>
                          {journey.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditJourney(journey);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleJourneyActive(journey.id);
                            }}
                          >
                            {journey.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteJourney(journey.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.isCompleted}
                                onChange={() => {
                                  setJourneyItems(journeyItems.map(i => 
                                    i.id === item.id 
                                      ? { ...i, isCompleted: !i.isCompleted, updatedAt: new Date() }
                                      : i
                                  ));
                                }}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {item.duration && (
                              <span className="text-sm text-gray-500">
                                {formatDuration(item.duration)}
                              </span>
                            )}
                            <Badge variant={item.isPublished ? "default" : "secondary"}>
                              {item.isPublished ? "Publicado" : "Rascunho"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleItemPublished(item.id)}
                              >
                                {item.isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddItem(journey.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Adicionar Item */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Item da Jornada</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item-title">Título do Item</Label>
              <Input
                id="item-title"
                value={itemFormData.title}
                onChange={(e) => setItemFormData({...itemFormData, title: e.target.value})}
                placeholder="Ex: Boas Vindas"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-description">Descrição</Label>
              <Textarea
                id="item-description"
                value={itemFormData.description}
                onChange={(e) => setItemFormData({...itemFormData, description: e.target.value})}
                placeholder="Descreva o item"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-order">Ordem</Label>
              <Input
                id="item-order"
                type="number"
                value={itemFormData.order}
                onChange={(e) => setItemFormData({...itemFormData, order: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-duration">Duração (segundos)</Label>
              <Input
                id="item-duration"
                type="number"
                value={itemFormData.duration}
                onChange={(e) => setItemFormData({...itemFormData, duration: parseInt(e.target.value)})}
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-video">URL do Vídeo (opcional)</Label>
              <Input
                id="item-video"
                value={itemFormData.videoUrl}
                onChange={(e) => setItemFormData({...itemFormData, videoUrl: e.target.value})}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="item-isPublished"
                checked={itemFormData.isPublished}
                onCheckedChange={(checked) => setItemFormData({...itemFormData, isPublished: checked})}
              />
              <Label htmlFor="item-isPublished">Item Publicado</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveItem}>
              Salvar Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Item */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Item da Jornada</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-item-title">Título do Item</Label>
              <Input
                id="edit-item-title"
                value={itemFormData.title}
                onChange={(e) => setItemFormData({...itemFormData, title: e.target.value})}
                placeholder="Ex: Boas Vindas"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-description">Descrição</Label>
              <Textarea
                id="edit-item-description"
                value={itemFormData.description}
                onChange={(e) => setItemFormData({...itemFormData, description: e.target.value})}
                placeholder="Descreva o item"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-order">Ordem</Label>
              <Input
                id="edit-item-order"
                type="number"
                value={itemFormData.order}
                onChange={(e) => setItemFormData({...itemFormData, order: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-duration">Duração (segundos)</Label>
              <Input
                id="edit-item-duration"
                type="number"
                value={itemFormData.duration}
                onChange={(e) => setItemFormData({...itemFormData, duration: parseInt(e.target.value)})}
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-video">URL do Vídeo (opcional)</Label>
              <Input
                id="edit-item-video"
                value={itemFormData.videoUrl}
                onChange={(e) => setItemFormData({...itemFormData, videoUrl: e.target.value})}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-item-isPublished"
                checked={itemFormData.isPublished}
                onCheckedChange={(checked) => setItemFormData({...itemFormData, isPublished: checked})}
              />
              <Label htmlFor="edit-item-isPublished">Item Publicado</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveItem}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Jornada */}
      <Dialog open={isEditJourneyDialogOpen} onOpenChange={setIsEditJourneyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Jornada</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-journey-title">Título da Jornada</Label>
              <Input
                id="edit-journey-title"
                value={journeyFormData.title}
                onChange={(e) => setJourneyFormData({...journeyFormData, title: e.target.value})}
                placeholder="Ex: Jornada 15 Dias"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-journey-description">Descrição</Label>
              <Textarea
                id="edit-journey-description"
                value={journeyFormData.description}
                onChange={(e) => setJourneyFormData({...journeyFormData, description: e.target.value})}
                placeholder="Descreva a jornada"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-journey-duration">Duração (dias)</Label>
              <Input
                id="edit-journey-duration"
                type="number"
                value={journeyFormData.duration}
                onChange={(e) => setJourneyFormData({...journeyFormData, duration: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-journey-isActive"
                checked={journeyFormData.isActive}
                onCheckedChange={(checked) => setJourneyFormData({...journeyFormData, isActive: checked})}
              />
              <Label htmlFor="edit-journey-isActive">Jornada Ativa</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditJourneyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveJourney}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 