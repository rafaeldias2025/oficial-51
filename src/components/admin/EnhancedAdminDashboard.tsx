import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AdminPanel } from './AdminPanel';
// SessionManager temporariamente desabilitado
import { ToolManager } from './ToolManager';
// Assessment functionality temporarily disabled
import { SystemSettings } from './SystemSettings';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  FileText,
  ClipboardList,
  Users,
  CheckCircle,
  BarChart
} from 'lucide-react';

export const EnhancedAdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <Button variant="outline">
            Admin
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <nav className="space-y-1">
              <Button
                variant={selectedTab === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={selectedTab === 'courses' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('courses')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Cursos
              </Button>
              <Button
                variant={selectedTab === 'sessions' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('sessions')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Sessões
              </Button>
              <Button
                variant={selectedTab === 'tools' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('tools')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Ferramentas
              </Button>
              <Button
                variant={selectedTab === 'assessments' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('assessments')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Avaliações
              </Button>
              <Button
                variant={selectedTab === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Sistema
              </Button>
            </nav>

            {/* Dashboard Summary */}
            {selectedTab === 'dashboard' && (
              <div className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">47</p>
                        <p className="text-xs text-muted-foreground">Clientes Ativos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">124</p>
                        <p className="text-xs text-muted-foreground">Sessões Hoje</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">89%</p>
                        <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BarChart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">94%</p>
                        <p className="text-xs text-muted-foreground">Engajamento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Gerenciar Cursos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Gerenciar Sessões
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Ferramentas
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            {selectedTab === 'dashboard' && (
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral</CardTitle>
                  <CardDescription>
                    Resumo das atividades recentes e métricas importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Dashboard content */}
                  <p>Conteúdo do dashboard vai aqui...</p>
                </CardContent>
              </Card>
            )}
            {selectedTab === 'courses' && <AdminPanel />}
            {selectedTab === 'sessions' && <div className="p-6 text-center text-muted-foreground">SessionManager temporariamente desabilitado</div>}
            {selectedTab === 'tools' && <ToolManager />}
            {selectedTab === 'assessments' && <div className="p-6 text-center text-muted-foreground">Funcionalidade de avaliações temporariamente desabilitada</div>}
            {selectedTab === 'settings' && <SystemSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};