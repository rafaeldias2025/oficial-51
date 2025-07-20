import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Activity, 
  Target, 
  TrendingUp, 
  Scale,
  Smartphone,
  Wifi,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import WeeklyWeighingDemo from '@/components/demo/WeeklyWeighingDemo';

const HealthDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Sistema de Saúde</h1>
              <p className="text-lg text-gray-600 mt-2">
                Plataforma completa para monitoramento de saúde e bem-estar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Conectado
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ativo
              </Badge>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balança</CardTitle>
                <Scale className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Conectada</div>
                <p className="text-xs text-muted-foreground">openScale Ready</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Google Fit</CardTitle>
                <Smartphone className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">Sincronizado</div>
                <p className="text-xs text-muted-foreground">Dados atualizados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Análises</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">Ativas</div>
                <p className="text-xs text-muted-foreground">IA em tempo real</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Metas</CardTitle>
                <Target className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">85%</div>
                <p className="text-xs text-muted-foreground">Progresso semanal</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pesagens" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pesagens" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Pesagens
            </TabsTrigger>
            <TabsTrigger value="analises" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Análises
            </TabsTrigger>
            <TabsTrigger value="metas" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pesagens" className="space-y-4">
            <WeeklyWeighingDemo />
          </TabsContent>

          <TabsContent value="analises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análises Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Análises Disponíveis:</p>
                        <ul className="text-blue-700 mt-1 space-y-1">
                          <li>• Tendências de peso ao longo do tempo</li>
                          <li>• Correlação com atividade física</li>
                          <li>• Análise de padrões alimentares</li>
                          <li>• Predições baseadas em IA</li>
                          <li>• Relatórios personalizados</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Tendência de Peso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-muted-foreground">Gráfico de tendência</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Correlações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-muted-foreground">Análise de correlações</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas e Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Meta de Peso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">68.5 kg</div>
                          <div className="text-sm text-muted-foreground">Meta: 65.0 kg</div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Atividade Física</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">4x/semana</div>
                          <div className="text-sm text-muted-foreground">Meta: 5x/semana</div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Hidratação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">2.5L</div>
                          <div className="text-sm text-muted-foreground">Meta: 3.0L</div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-green-900">Próximas Ações:</p>
                        <ul className="text-green-700 mt-1 space-y-1">
                          <li>• Aumentar frequência de exercícios</li>
                          <li>• Manter hidratação consistente</li>
                          <li>• Monitorar progresso semanal</li>
                          <li>• Ajustar metas conforme necessário</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Integrações</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">openScale</span>
                          </div>
                          <Badge variant="outline" className="text-green-600">Conectado</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Google Fit</span>
                          </div>
                          <Badge variant="outline" className="text-blue-600">Sincronizado</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium">IA Analytics</span>
                          </div>
                          <Badge variant="outline" className="text-purple-600">Ativo</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Preferências</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">Notificações</span>
                          <Badge variant="secondary">Ativadas</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">Frequência de Pesagem</span>
                          <Badge variant="secondary">Semanal</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">Relatórios</span>
                          <Badge variant="secondary">Automáticos</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">Modo Escuro</span>
                          <Badge variant="outline">Desativado</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-900">Informações Importantes:</p>
                        <ul className="text-yellow-700 mt-1 space-y-1">
                          <li>• Sistema integrado com balança openScale</li>
                          <li>• Dados sincronizados automaticamente</li>
                          <li>• Análises baseadas em IA</li>
                          <li>• Relatórios personalizados disponíveis</li>
                          <li>• Suporte técnico 24/7</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthDemo; 