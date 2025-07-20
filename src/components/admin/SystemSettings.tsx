import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Upload, 
  FileText, 
  Users, 
  Calendar,
  Activity,
  Database,
  Shield,
  Bell,
  Palette,
  TrendingUp
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('media');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Gerencie todas as configurações da plataforma</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Mídia
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Gerenciamento de Mídia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Upload de Arquivos</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Gerencie uploads de imagens, vídeos e documentos
                  </p>
                  <Button size="sm" className="w-full">
                    Gerenciar Uploads
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold">Biblioteca de Mídia</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Visualize e organize todos os arquivos
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Biblioteca
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold">Armazenamento</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Monitore o uso de espaço em disco
                  </p>
                  <Badge variant="outline">2.3 GB / 10 GB</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciamento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Lista de Usuários</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Visualize e gerencie todos os usuários
                  </p>
                  <Button size="sm" className="w-full">
                    Ver Usuários
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold">Permissões</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure níveis de acesso
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold">Atividade</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Monitore atividades dos usuários
                  </p>
                  <Badge variant="outline">47 ativos</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Relatórios e Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Relatórios de Uso</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Visualize métricas de engajamento
                  </p>
                  <Button size="sm" className="w-full">
                    Gerar Relatório
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold">Relatórios Mensais</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Relatórios automáticos mensais
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold">Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Dados detalhados de performance
                  </p>
                  <Badge variant="outline">94% engajamento</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">Notificações</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure alertas e notificações
                  </p>
                  <Button size="sm" className="w-full">
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold">Aparência</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Personalize cores e temas
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Personalizar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold">Backup</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure backups automáticos
                  </p>
                  <Badge variant="outline">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 