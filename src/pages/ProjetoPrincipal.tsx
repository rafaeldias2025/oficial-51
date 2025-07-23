import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, ComposedChart, ReferenceLine, PieChart, Pie,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  User, Mail, Scale, Ruler, Heart, Home, Activity, Trophy, 
  Target, Award, FileText, Calendar, BarChart3, Settings,
  ArrowLeft, Menu, X, LogOut, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Zap, Clock, Star, Users, Brain,
  Dumbbell, Apple, Coffee, Flame, Droplets, Bone, Eye, Zap as ZapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dados simulados completos do projeto
const dadosProjeto = {
  totalClientes: 1247,
  clientesAtivos: 892,
  clientesNovos: 45,
  metaMensal: 150,
  faturamento: 284500,
  faturamentoMeta: 300000,
  satisfacao: 4.8,
  retencao: 87.3,
  conversao: 23.5
};

// Dados para gráficos de pizza
const dadosDistribuicao = [
  { name: 'Emagrecimento', value: 45, color: '#3b82f6' },
  { name: 'Hipertrofia', value: 28, color: '#8b5cf6' },
  { name: 'Saúde', value: 15, color: '#10b981' },
  { name: 'Reabilitação', value: 12, color: '#f59e0b' }
];

const dadosIdade = [
  { name: '18-25', value: 22, color: '#ef4444' },
  { name: '26-35', value: 35, color: '#f97316' },
  { name: '36-45', value: 28, color: '#eab308' },
  { name: '46-55', value: 12, color: '#84cc16' },
  { name: '55+', value: 3, color: '#22c55e' }
];

const dadosGenero = [
  { name: 'Feminino', value: 68, color: '#ec4899' },
  { name: 'Masculino', value: 32, color: '#3b82f6' }
];

const dadosPlano = [
  { name: 'Premium', value: 35, color: '#fbbf24' },
  { name: 'Standard', value: 45, color: '#34d399' },
  { name: 'Básico', value: 20, color: '#60a5fa' }
];

// Dados para gráficos de linha
const dadosEvolucao = [
  { mes: 'Jan', clientes: 980, faturamento: 245000, satisfacao: 4.6 },
  { mes: 'Fev', clientes: 1020, faturamento: 255000, satisfacao: 4.7 },
  { mes: 'Mar', clientes: 1080, faturamento: 270000, satisfacao: 4.8 },
  { mes: 'Abr', clientes: 1120, faturamento: 280000, satisfacao: 4.8 },
  { mes: 'Mai', clientes: 1180, faturamento: 295000, satisfacao: 4.9 },
  { mes: 'Jun', clientes: 1247, faturamento: 284500, satisfacao: 4.8 }
];

// Dados para radar chart
const dadosRadar = [
  { subject: 'Emagrecimento', A: 95, B: 85, fullMark: 100 },
  { subject: 'Hipertrofia', A: 88, B: 92, fullMark: 100 },
  { subject: 'Flexibilidade', A: 82, B: 78, fullMark: 100 },
  { subject: 'Resistência', A: 90, B: 85, fullMark: 100 },
  { subject: 'Força', A: 87, B: 90, fullMark: 100 },
  { subject: 'Saúde', A: 94, B: 88, fullMark: 100 }
];

// Dados para gráfico de barras
const dadosMetas = [
  { categoria: 'Emagrecimento', meta: 85, atual: 78, cor: '#3b82f6' },
  { categoria: 'Hipertrofia', meta: 70, atual: 65, cor: '#8b5cf6' },
  { categoria: 'Flexibilidade', meta: 90, atual: 82, cor: '#10b981' },
  { categoria: 'Resistência', meta: 80, atual: 75, cor: '#f59e0b' },
  { categoria: 'Força', meta: 75, atual: 72, cor: '#ef4444' }
];

const ProjetoPrincipal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Instituto dos Sonhos</h1>
              <p className="text-xl text-blue-100">Dashboard Principal - Análise Completa</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">{dadosProjeto.totalClientes}</div>
              <div className="text-blue-100">Total de Clientes</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Clientes Ativos</p>
                    <p className="text-3xl font-bold">{dadosProjeto.clientesAtivos}</p>
                    <div className="flex items-center text-green-200 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% este mês
                    </div>
                  </div>
                  <Users className="w-12 h-12 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Faturamento</p>
                    <p className="text-3xl font-bold">R$ {dadosProjeto.faturamento.toLocaleString()}</p>
                    <div className="flex items-center text-blue-200 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {((dadosProjeto.faturamento / dadosProjeto.faturamentoMeta) * 100).toFixed(1)}% da meta
                    </div>
                  </div>
                  <Dumbbell className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Satisfação</p>
                    <p className="text-3xl font-bold">{dadosProjeto.satisfacao}/5.0</p>
                    <div className="flex items-center text-purple-200 text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      Excelente
                    </div>
                  </div>
                  <Star className="w-12 h-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Retenção</p>
                    <p className="text-3xl font-bold">{dadosProjeto.retencao}%</p>
                    <div className="flex items-center text-orange-200 text-sm">
                      <ZapIcon className="w-4 h-4 mr-1" />
                      Acima da média
                    </div>
                  </div>
                  <Trophy className="w-12 h-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-blue-50 to-purple-50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="pie" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              Pizza
            </TabsTrigger>
            <TabsTrigger value="radar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              Radar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução Mensal */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-indigo-800">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Evolução Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dadosEvolucao}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="mes" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="faturamento" 
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fill="url(#faturamentoGradient)"
                          name="Faturamento (R$)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="clientes" 
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          name="Clientes"
                        />
                        <defs>
                          <linearGradient id="faturamentoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Metas por Categoria */}
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-emerald-800">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Metas por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosMetas}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="categoria" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                        <Bar dataKey="meta" fill="#10b981" name="Meta" />
                        <Bar dataKey="atual" fill="#3b82f6" name="Atual" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gráficos */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Satisfação ao Longo do Tempo */}
              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-pink-800">
                    <Star className="w-5 h-5 text-pink-600" />
                    Satisfação ao Longo do Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dadosEvolucao}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="mes" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" domain={[4, 5]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="satisfacao" 
                          stroke="#ec4899"
                          strokeWidth={4}
                          dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                          name="Satisfação"
                        />
                        <ReferenceLine y={4.5} stroke="#f59e0b" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Crescimento de Clientes */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <Users className="w-5 h-5 text-blue-600" />
                    Crescimento de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dadosEvolucao}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="mes" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="clientes" 
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fill="url(#clientesGradient)"
                          name="Clientes"
                        />
                        <defs>
                          <linearGradient id="clientesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gráficos de Pizza */}
          <TabsContent value="pie" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distribuição por Objetivo */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-green-800">
                    <Target className="w-5 h-5 text-green-600" />
                    Distribuição por Objetivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosDistribuicao}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosDistribuicao.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribuição por Idade */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-orange-800">
                    <User className="w-5 h-5 text-orange-600" />
                    Distribuição por Idade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosIdade}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosIdade.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribuição por Gênero */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <Users className="w-5 h-5 text-purple-600" />
                    Distribuição por Gênero
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosGenero}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosGenero.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribuição por Plano */}
              <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-yellow-800">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Distribuição por Plano
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosPlano}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosPlano.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gráfico Radar */}
          <TabsContent value="radar" className="space-y-6">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-indigo-800">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Análise de Performance por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dadosRadar}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                      <Radar
                        name="Meta"
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Atual"
                        dataKey="B"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* KPIs Principais */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    KPIs Principais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Taxa de Conversão</span>
                    <Badge className="bg-green-100 text-green-800">{dadosProjeto.conversao}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Taxa de Retenção</span>
                    <Badge className="bg-blue-100 text-blue-800">{dadosProjeto.retencao}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Satisfação</span>
                    <Badge className="bg-purple-100 text-purple-800">{dadosProjeto.satisfacao}/5.0</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Meta Mensal</span>
                    <Badge className="bg-orange-100 text-orange-800">{dadosProjeto.metaMensal}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Progresso da Meta */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-green-800">
                    <Target className="w-5 h-5 text-green-600" />
                    Progresso da Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Faturamento</span>
                      <span className="text-sm text-gray-600">
                        {((dadosProjeto.faturamento / dadosProjeto.faturamentoMeta) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(dadosProjeto.faturamento / dadosProjeto.faturamentoMeta) * 100} 
                      className="h-3 bg-green-100" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Novos Clientes</span>
                      <span className="text-sm text-gray-600">
                        {((dadosProjeto.clientesNovos / dadosProjeto.metaMensal) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(dadosProjeto.clientesNovos / dadosProjeto.metaMensal) * 100} 
                      className="h-3 bg-blue-100" 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas Rápidas */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <ZapIcon className="w-5 h-5 text-purple-600" />
                    Estatísticas Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{dadosProjeto.clientesAtivos}</div>
                    <div className="text-sm text-gray-600">Clientes Ativos</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{dadosProjeto.clientesNovos}</div>
                    <div className="text-sm text-gray-600">Novos Este Mês</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {(dadosProjeto.faturamento / 1000).toFixed(0)}k
                    </div>
                    <div className="text-sm text-gray-600">Faturamento</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjetoPrincipal; 