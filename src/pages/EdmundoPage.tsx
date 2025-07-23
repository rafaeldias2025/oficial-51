import React, { useState } from 'react';
import { MeuProgresso } from '@/components/MeuProgresso';
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
  Dumbbell, Apple, Coffee, Flame, Droplets, Bone, Eye, Zap as ZapIcon,
  Thermometer, Activity as ActivityIcon, Moon, Sun, Wifi, Battery, WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dados de saúde do Edmundo Roveri
const edmundoSaude = {
  nome: "Edmundo Roveri",
  email: "edmundoroveri@hotmail.com",
  altura: 179,
  pesoAtual: 109.3,
  pesoOntem: 110.3,
  pesoInicial: 115.2,
  pesoIdeal: 75.0,
  circunferenciaAtual: 125,
  circunferenciaOntem: 128,
  imc: 34.1,
  imcOntem: 34.4,
  imcIdeal: 23.4,
  gorduraCorporal: 29.5,
  massaMuscular: 47.5,
  aguaCorporal: 47.3,
  pressaoSistolica: 140,
  pressaoDiastolica: 90,
  frequenciaCardiaca: 85,
  oxigenacao: 96,
  glicose: 95,
  colesterolTotal: 220,
  hdl: 45,
  ldl: 150,
  triglicerides: 180,
  metaPeso: 85.0,
  idade: 45,
  genero: "masculino",
  pesoPerdido: 5.9,
  progressoMeta: 19.5,
  scoreSaude: 78,
  nivelAtividade: "Moderado",
  qualidadeSono: 7.2,
  estresse: 6.5,
  batimentosCardiacos: 85,
  temperatura: 36.8,
  saturacaoOxigenio: 96,
  passos: 8420,
  calorias: 1850,
  aguaConsumida: 2.1,
  sonoHoras: 7.5,
  qualidadeAr: 85,
  umidade: 65,
  pressaoAtmosferica: 1013
};

// Dados para gráficos de saúde
const dadosPeso = [
  { dia: 'Seg', peso: 111.2, imc: 34.7, gordura: 30.2 },
  { dia: 'Ter', peso: 110.8, imc: 34.6, gordura: 30.0 },
  { dia: 'Qua', peso: 110.5, imc: 34.5, gordura: 29.9 },
  { dia: 'Qui', peso: 110.1, imc: 34.3, gordura: 29.7 },
  { dia: 'Sex', peso: 109.8, imc: 34.2, gordura: 29.6 },
  { dia: 'Sáb', peso: 109.5, imc: 34.1, gordura: 29.5 },
  { dia: 'Dom', peso: 109.3, imc: 34.1, gordura: 29.5 }
];

const dadosComposicao = [
  { componente: 'Gordura', atual: 29.5, ideal: 15, cor: '#ff6b6b' },
  { componente: 'Músculo', atual: 47.5, ideal: 45, cor: '#4ecdc4' },
  { componente: 'Água', atual: 47.3, ideal: 60, cor: '#45b7d1' },
  { componente: 'Osso', atual: 3.2, ideal: 3.5, cor: '#96ceb4' }
];

const dadosRadarSaude = [
  { subject: 'Peso', A: 85, B: 65, fullMark: 100 },
  { subject: 'IMC', A: 90, B: 45, fullMark: 100 },
  { subject: 'Pressão', A: 80, B: 70, fullMark: 100 },
  { subject: 'Colesterol', A: 85, B: 60, fullMark: 100 },
  { subject: 'Atividade', A: 75, B: 55, fullMark: 100 },
  { subject: 'Sono', A: 80, B: 65, fullMark: 100 }
];

const dadosPressao = [
  { data: 'Seg', sistolica: 145, diastolica: 95 },
  { data: 'Ter', sistolica: 142, diastolica: 92 },
  { data: 'Qua', sistolica: 140, diastolica: 90 },
  { data: 'Qui', sistolica: 138, diastolica: 88 },
  { data: 'Sex', sistolica: 135, diastolica: 85 },
  { data: 'Sáb', sistolica: 132, diastolica: 83 },
  { data: 'Dom', sistolica: 130, diastolica: 80 }
];

const dadosBatimentos = [
  { hora: '06:00', batimentos: 72 },
  { hora: '09:00', batimentos: 78 },
  { hora: '12:00', batimentos: 85 },
  { hora: '15:00', batimentos: 82 },
  { hora: '18:00', batimentos: 88 },
  { hora: '21:00', batimentos: 75 },
  { hora: '00:00', batimentos: 68 }
];

const dadosAtividade = [
  { hora: '06:00', passos: 1200, calorias: 150 },
  { hora: '09:00', passos: 2800, calorias: 320 },
  { hora: '12:00', passos: 4500, calorias: 520 },
  { hora: '15:00', passos: 6200, calorias: 780 },
  { hora: '18:00', passos: 7800, calorias: 950 },
  { hora: '21:00', passos: 8420, calorias: 1850 }
];

const dadosSono = [
  { fase: 'Leve', horas: 2.5, cor: '#ffd93d' },
  { fase: 'Profundo', horas: 3.2, cor: '#6bcf7f' },
  { fase: 'REM', horas: 1.8, cor: '#4d96ff' }
];

const EdmundoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Edmundo Roveri - Saúde</h1>
              <p className="text-xl text-purple-100">Dashboard de Saúde Completo</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">{edmundoSaude.scoreSaude}%</div>
              <div className="text-purple-100">Score de Saúde</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Métricas Principais de Saúde */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Peso Atual</p>
                    <p className="text-3xl font-bold">{edmundoSaude.pesoAtual}kg</p>
                    <div className="flex items-center text-red-200 text-sm">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      -{edmundoSaude.pesoPerdido}kg
                    </div>
                  </div>
                  <Scale className="w-12 h-12 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">IMC</p>
                    <p className="text-3xl font-bold">{edmundoSaude.imc}</p>
                    <div className="flex items-center text-orange-200 text-sm">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Obesidade Grau I
                    </div>
                  </div>
                  <Heart className="w-12 h-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Pressão</p>
                    <p className="text-3xl font-bold">{edmundoSaude.pressaoSistolica}/{edmundoSaude.pressaoDiastolica}</p>
                    <div className="flex items-center text-blue-200 text-sm">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Pré-hipertensão
                    </div>
                  </div>
                  <Droplets className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Batimentos</p>
                    <p className="text-3xl font-bold">{edmundoSaude.batimentosCardiacos} bpm</p>
                    <div className="flex items-center text-green-200 text-sm">
                      <Heart className="w-4 h-4 mr-1" />
                      Normal
                    </div>
                  </div>
                  <Heart className="w-12 h-12 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Métricas Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Passos</p>
                    <p className="text-3xl font-bold">{edmundoSaude.passos.toLocaleString()}</p>
                    <div className="flex items-center text-purple-200 text-sm">
                      <ActivityIcon className="w-4 h-4 mr-1" />
                      Meta: 10.000
                    </div>
                  </div>
                  <ActivityIcon className="w-12 h-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium">Calorias</p>
                    <p className="text-3xl font-bold">{edmundoSaude.calorias}</p>
                    <div className="flex items-center text-pink-200 text-sm">
                      <Flame className="w-4 h-4 mr-1" />
                      Queimadas
                    </div>
                  </div>
                  <Flame className="w-12 h-12 text-pink-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-medium">Água</p>
                    <p className="text-3xl font-bold">{edmundoSaude.aguaConsumida}L</p>
                    <div className="flex items-center text-cyan-200 text-sm">
                      <Droplets className="w-4 h-4 mr-1" />
                      Consumida
                    </div>
                  </div>
                  <Droplets className="w-12 h-12 text-cyan-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Sono</p>
                    <p className="text-3xl font-bold">{edmundoSaude.sonoHoras}h</p>
                    <div className="flex items-center text-indigo-200 text-sm">
                      <Moon className="w-4 h-4 mr-1" />
                      Qualidade: {edmundoSaude.qualidadeSono}/10
                    </div>
                  </div>
                  <Moon className="w-12 h-12 text-indigo-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="pie" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Composição
            </TabsTrigger>
            <TabsTrigger value="radar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Radar
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Atividade
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Análises
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução do Peso */}
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-red-800">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Evolução do Peso Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dadosPeso}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="dia" stroke="#6b7280" />
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
                          dataKey="peso" 
                          stroke="#ff6b6b"
                          strokeWidth={3}
                          fill="url(#pesoGradient)"
                          name="Peso (kg)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="imc" 
                          stroke="#ffa726"
                          strokeWidth={3}
                          name="IMC"
                        />
                        <defs>
                          <linearGradient id="pesoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Batimentos Cardíacos */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-green-800">
                    <Heart className="w-5 h-5 text-green-600" />
                    Batimentos Cardíacos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dadosBatimentos}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="hora" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
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
                          dataKey="batimentos" 
                          stroke="#4ade80"
                          strokeWidth={4}
                          dot={{ fill: '#4ade80', strokeWidth: 2, r: 6 }}
                          name="Batimentos (bpm)"
                        />
                        <ReferenceLine y={60} stroke="#10b981" strokeDasharray="3 3" label="Mínimo" />
                        <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label="Máximo" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gráficos */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IMC ao Longo do Tempo */}
              <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-orange-800">
                    <Heart className="w-5 h-5 text-orange-600" />
                    IMC ao Longo do Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dadosPeso}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="dia" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" domain={[30, 40]} />
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
                          dataKey="imc" 
                          stroke="#ffa726"
                          strokeWidth={4}
                          dot={{ fill: '#ffa726', strokeWidth: 2, r: 6 }}
                          name="IMC"
                        />
                        <ReferenceLine y={30} stroke="#4ade80" strokeDasharray="3 3" label="Normal" />
                        <ReferenceLine y={35} stroke="#ef4444" strokeDasharray="3 3" label="Obesidade" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pressão Arterial */}
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    Pressão Arterial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosPressao}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="data" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                        <Bar dataKey="sistolica" fill="#3b82f6" name="Sistólica" />
                        <Bar dataKey="diastolica" fill="#06b6d4" name="Diastólica" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gráficos de Pizza - Composição Corporal */}
          <TabsContent value="pie" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Composição Corporal */}
              <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <Scale className="w-5 h-5 text-purple-600" />
                    Composição Corporal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosComposicao}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ componente, atual }) => `${componente} ${atual}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="atual"
                        >
                          {dadosComposicao.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
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

              {/* Comparação Ideal vs Atual */}
              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-pink-800">
                    <Target className="w-5 h-5 text-pink-600" />
                    Meta vs Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dadosComposicao.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{item.componente}</span>
                          <div className="flex gap-2">
                            <Badge className="bg-red-100 text-red-800">{item.atual}%</Badge>
                            <Badge className="bg-green-100 text-green-800">{item.ideal}%</Badge>
                          </div>
                        </div>
                        <Progress 
                          value={(item.atual / item.ideal) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gráfico Radar - Saúde */}
          <TabsContent value="radar" className="space-y-6">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-indigo-800">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Análise Completa de Saúde
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dadosRadarSaude}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                      <Radar
                        name="Meta"
                        dataKey="A"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Atual"
                        dataKey="B"
                        stroke="#ef4444"
                        fill="#ef4444"
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

          {/* Atividade */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Atividade Diária */}
              <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <ActivityIcon className="w-5 h-5 text-purple-600" />
                    Atividade Diária
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dadosAtividade}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="hora" stroke="#6b7280" />
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
                          dataKey="passos" 
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          fill="url(#passosGradient)"
                          name="Passos"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="calorias" 
                          stroke="#ec4899"
                          strokeWidth={3}
                          name="Calorias"
                        />
                        <defs>
                          <linearGradient id="passosGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Qualidade do Sono */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-indigo-800">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    Qualidade do Sono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosSono}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ fase, horas }) => `${fase} ${horas}h`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="horas"
                        >
                          {dadosSono.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
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

          {/* Analytics de Saúde */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Indicadores de Saúde */}
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <Heart className="w-5 h-5 text-blue-600" />
                    Indicadores de Saúde
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Frequência Cardíaca</span>
                    <Badge className="bg-orange-100 text-orange-800">{edmundoSaude.frequenciaCardiaca} bpm</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Oxigenação</span>
                    <Badge className="bg-green-100 text-green-800">{edmundoSaude.oxigenacao}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Glicose</span>
                    <Badge className="bg-blue-100 text-blue-800">{edmundoSaude.glicose} mg/dL</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium">Temperatura</span>
                    <Badge className="bg-purple-100 text-purple-800">{edmundoSaude.temperatura}°C</Badge>
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
                      <span className="font-medium">Peso</span>
                      <span className="text-sm text-gray-600">
                        {((edmundoSaude.pesoPerdido / (edmundoSaude.pesoInicial - edmundoSaude.metaPeso)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(edmundoSaude.pesoPerdido / (edmundoSaude.pesoInicial - edmundoSaude.metaPeso)) * 100} 
                      className="h-3 bg-green-100" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">IMC</span>
                      <span className="text-sm text-gray-600">
                        {((edmundoSaude.imcIdeal / edmundoSaude.imc) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(edmundoSaude.imcIdeal / edmundoSaude.imc) * 100} 
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
                    <div className="text-2xl font-bold text-purple-600">{edmundoSaude.pesoPerdido}kg</div>
                    <div className="text-sm text-gray-600">Peso Perdido</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{edmundoSaude.scoreSaude}%</div>
                    <div className="text-sm text-gray-600">Score de Saúde</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{edmundoSaude.massaMuscular}%</div>
                    <div className="text-sm text-gray-600">Massa Muscular</div>
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

export default EdmundoPage; 