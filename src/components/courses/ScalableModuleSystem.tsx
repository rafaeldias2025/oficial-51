import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Grid, Layers } from 'lucide-react';
import { usePremiumCourses } from '@/hooks/usePremiumCourses';
import { ModuleConfig } from '@/types/premium';

interface ScalableModuleSystemProps {
  courseId: string;
  isAdmin?: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

type DisplayMode = 'direct' | 'course-based';

interface ModuleFormData {
  display_mode: DisplayMode;
  show_module_activation: boolean;
  active_modules: string[];
}

export const ScalableModuleSystem: React.FC<ScalableModuleSystemProps> = ({ courseId, isAdmin = false }) => {
  const { getModuleConfig, updateModuleConfig } = usePremiumCourses();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ModuleConfig | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Mock modules (substituir por dados reais)
  const [modules] = useState<ModuleItem[]>([
    { id: '1', title: 'Introdução', description: 'Conceitos básicos e visão geral', isActive: true },
    { id: '2', title: 'Fundamentos', description: 'Princípios essenciais', isActive: true },
    { id: '3', title: 'Prática', description: 'Exercícios e aplicações', isActive: false },
    { id: '4', title: 'Avançado', description: 'Tópicos complexos', isActive: false },
  ]);

  // Form state
  const [formData, setFormData] = useState<ModuleFormData>({
    display_mode: 'direct',
    show_module_activation: true,
    active_modules: []
  });

  useEffect(() => {
    const loadConfig = async () => {
      const data = await getModuleConfig(courseId);
      if (data) {
        setConfig(data);
        setFormData({
          display_mode: data.display_mode,
          show_module_activation: data.show_module_activation,
          active_modules: data.active_modules || []
        });
      }
      setLoading(false);
    };

    loadConfig();
  }, [courseId, getModuleConfig]);

  const handleSave = async () => {
    await updateModuleConfig(courseId, formData);
    setEditMode(false);
    const updatedConfig = await getModuleConfig(courseId);
    if (updatedConfig) {
      setConfig(updatedConfig);
    }
  };

  const toggleModuleActivation = (moduleId: string) => {
    setFormData(prev => {
      const newActiveModules = prev.active_modules.includes(moduleId)
        ? prev.active_modules.filter(id => id !== moduleId)
        : [...prev.active_modules, moduleId];

      return {
        ...prev,
        active_modules: newActiveModules
      };
    });
  };

  const handleDisplayModeChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      display_mode: checked ? 'course-based' : 'direct'
    }));
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
              <Label>Modo de Exibição</Label>
              <div className="flex items-center space-x-2">
                <Label>Direto</Label>
                <Switch
                  checked={formData.display_mode === 'course-based'}
                  onCheckedChange={handleDisplayModeChange}
                />
                <Label>Baseado em Curso</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-activation"
                checked={formData.show_module_activation}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  show_module_activation: checked
                }))}
              />
              <Label htmlFor="show-activation">
                Mostrar ativação de módulos
              </Label>
            </div>

            {formData.show_module_activation && (
              <div className="space-y-4">
                <Label>Módulos Ativos</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {modules.map(module => (
                      <div key={module.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`module-${module.id}`}
                          checked={formData.active_modules.includes(module.id)}
                          onCheckedChange={() => toggleModuleActivation(module.id)}
                        />
                        <div>
                          <Label
                            htmlFor={`module-${module.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {module.title}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

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
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {config?.display_mode === 'course-based' ? (
              <Layers className="h-5 w-5" />
            ) : (
              <Grid className="h-5 w-5" />
            )}
            <h2 className="text-xl font-semibold">
              {config?.display_mode === 'course-based' ? 'Módulos do Curso' : 'Módulos Diretos'}
            </h2>
          </div>

          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              Editar Configuração
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {modules.map(module => {
            const isActive = !config?.show_module_activation || 
              (config.active_modules && config.active_modules.includes(module.id));

            return (
              <Card
                key={module.id}
                className={`transition-opacity ${!isActive ? 'opacity-50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                    {config?.show_module_activation && (
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 