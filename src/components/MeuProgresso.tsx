import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, ComposedChart, ReferenceLine 
} from 'recharts';
import {
  Scale, Activity, Target, TrendingUp, TrendingDown, BarChart3, 
  Bone, Droplets, Flame, Heart, Calendar, Timer, Trophy,
  Award, Star, Crown, Medal, Gift, Rocket, CheckCircle,
  AlertCircle, Info, Clock, Users, Brain, Dumbbell, Apple, Coffee, User
} from 'lucide-react';

// Dados simulados para Edmundo Roveri
const clienteEdmundo = {
  nome: "Edmundo Roveri",
  email: "edmundoroveri@hotmail.com",
  altura: 179, // cm
  pesoAtual: 109.3, // kg
  pesoInicial: 115.2, // kg
  circunferenciaAbdominal: 125, // cm
  metaPeso: 85.0, // kg
  idade: 45,
  genero: "masculino"
};

// Dados de evolução simulados (últimos 6 meses)
const dadosEvolucao = [
  { data: '2024-01-15', peso: 115.2, gordura: 32.5, musculo: 45.2, agua: 45.8, imc: 36.0, circunferencia: 128 },
  { data: '2024-02-15', peso: 113.8, gordura: 31.8, musculo: 45.8, agua: 46.2, imc: 35.5, circunferencia: 127 },
  { data: '2024-03-15', peso: 112.1, gordura: 31.2, musculo: 46.3, agua: 46.5, imc: 35.0, circunferencia: 126 },
  { data: '2024-04-15', peso: 110.9, gordura: 30.5, musculo: 46.8, agua: 46.8, imc: 34.6, circunferencia: 125.5 },
  { data: '2024-05-15', peso: 109.8, gordura: 29.9, musculo: 47.2, agua: 47.1, imc: 34.2, circunferencia: 125.2 },
  { data: '2024-06-15', peso: 109.3, gordura: 29.5, musculo: 47.5, agua: 47.3, imc: 34.1, circunferencia: 125 }
];

// Cálculos
const calcularIMC = (peso: number, altura: number) => peso / Math.pow(altura / 100, 2);
const calcularPesoIdeal = (altura: number, genero: string) => {
  if (genero === "masculino") {
    return (altura - 100) * 0.9;
  }
  return (altura - 100) * 0.85;
};

const pesoIdeal = calcularPesoIdeal(clienteEdmundo.altura, clienteEdmundo.genero);
const imcAtual = calcularIMC(clienteEdmundo.pesoAtual, clienteEdmundo.altura);
const imcInicial = calcularIMC(clienteEdmundo.pesoInicial, clienteEdmundo.altura);
const pesoPerdido = clienteEdmundo.pesoInicial - clienteEdmundo.pesoAtual;
const progressoMeta = ((clienteEdmundo.pesoInicial - clienteEdmundo.pesoAtual) / (clienteEdmundo.pesoInicial - clienteEdmundo.metaPeso)) * 100;

// Classificação IMC
const classificarIMC = (imc: number) => {
  if (imc < 18.5) return { categoria: "Abaixo do peso", cor: "text-blue-600" };
  if (imc < 25) return { categoria: "Peso normal", cor: "text-green-600" };
  if (imc < 30) return { categoria: "Sobrepeso", cor: "text-yellow-600" };
  if (imc < 35) return { categoria: "Obesidade Grau I", cor: "text-orange-600" };
  if (imc < 40) return { categoria: "Obesidade Grau II", cor: "text-red-600" };
  return { categoria: "Obesidade Grau III", cor: "text-red-800" };
};

const classificacaoIMC = classificarIMC(imcAtual);

// Score de evolução
const calcularScoreEvolucao = () => {
  let score = 50; // Base
  
  // Progresso do peso (30%)
  const progressoPeso = (pesoPerdido / (clienteEdmundo.pesoInicial - clienteEdmundo.metaPeso)) * 100;
  score += progressoPeso * 0.3;
  
  // Redução de gordura (25%)
  const reducaoGordura = dadosEvolucao[0].gordura - dadosEvolucao[dadosEvolucao.length - 1].gordura;
  score += reducaoGordura * 2;
  
  // Ganho de músculo (20%)
  const ganhoMusculo = dadosEvolucao[dadosEvolucao.length - 1].musculo - dadosEvolucao[0].musculo;
  score += ganhoMusculo * 3;
  
  // Consistência (15%)
  score += Math.min(15, dadosEvolucao.length * 2.5);
  
  // Melhora na circunferência (10%)
  const reducaoCircunferencia = dadosEvolucao[0].circunferencia - dadosEvolucao[dadosEvolucao.length - 1].circunferencia;
  score += reducaoCircunferencia * 0.5;
  
  return Math.max(0, Math.min(100, score));
};

const scoreEvolucao = calcularScoreEvolucao();

// Conquistas
const conquistas = [
  {
    id: 'primeira_perda',
    titulo: 'Primeira Perda',
    descricao: 'Perdeu os primeiros 2kg',
    icon: '🎯',
    desbloqueada: pesoPerdido >= 2,
    progresso: Math.min(100, (pesoPerdido / 2) * 100)
  },
  {
    id: 'reducao_gordura',
    titulo: 'Redução de Gordura',
    descricao: 'Reduziu 3% de gordura corporal',
    icon: '🔥',
    desbloqueada: dadosEvolucao[0].gordura - dadosEvolucao[dadosEvolucao.length - 1].gordura >= 3,
    progresso: Math.min(100, ((dadosEvolucao[0].gordura - dadosEvolucao[dadosEvolucao.length - 1].gordura) / 3) * 100)
  },
  {
    id: 'ganho_musculo',
    titulo: 'Ganho de Músculo',
    descricao: 'Ganhou 2kg de massa muscular',
    icon: '💪',
    desbloqueada: dadosEvolucao[dadosEvolucao.length - 1].musculo - dadosEvolucao[0].musculo >= 2,
    progresso: Math.min(100, ((dadosEvolucao[dadosEvolucao.length - 1].musculo - dadosEvolucao[0].musculo) / 2) * 100)
  },
  {
    id: 'consistencia',
    titulo: 'Consistência',
    descricao: 'Manteve acompanhamento por 6 meses',
    icon: '📅',
    desbloqueada: dadosEvolucao.length >= 6,
    progresso: Math.min(100, (dadosEvolucao.length / 6) * 100)
  }
];

export const MeuProgresso: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dados para gráficos
  const chartData = useMemo(() => {
    return dadosEvolucao.map((dado, index) => ({
      mes: `Mês ${index + 1}`,
      peso: dado.peso,
      gordura: dado.gordura,
      musculo: dado.musculo,
      imc: dado.imc,
      circunferencia: dado.circunferencia,
      agua: dado.agua
    }));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header com informações do cliente */}
      <Card className="bg-gradient-to-br from-instituto-orange/20 to-instituto-purple/20 border-instituto-orange/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="w-6 h-6 text-instituto-orange" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{clienteEdmundo.nome}</h2>
              <p className="text-sm text-gray-600">{clienteEdmundo.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{clienteEdmundo.pesoAtual}kg</div>
              <div className="text-sm text-gray-600">Peso Atual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{clienteEdmundo.altura}cm</div>
              <div className="text-sm text-gray-600">Altura</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{imcAtual.toFixed(1)}</div>
              <div className="text-sm text-gray-600">IMC Atual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{clienteEdmundo.circunferenciaAbdominal}cm</div>
              <div className="text-sm text-gray-600">Circunferência</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score de Evolução */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-600" />
            Score de Evolução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-green-600">{scoreEvolucao.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Progresso Geral</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">-{pesoPerdido.toFixed(1)}kg</div>
              <div className="text-sm text-gray-600">Peso Perdido</div>
            </div>
          </div>
          <Progress value={scoreEvolucao} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-instituto-orange" />
                  Metas e Progresso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Meta de Peso</span>
                    <span className="text-sm text-muted-foreground">
                      {clienteEdmundo.pesoAtual}kg → {clienteEdmundo.metaPeso}kg
                    </span>
                  </div>
                  <Progress value={progressoMeta} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso: {progressoMeta.toFixed(0)}%</span>
                    <span>Faltam: {(clienteEdmundo.pesoAtual - clienteEdmundo.metaPeso).toFixed(1)}kg</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">IMC</span>
                    <span className="text-sm text-muted-foreground">
                      {imcAtual.toFixed(1)} ({classificacaoIMC.categoria})
                    </span>
                  </div>
                  <Progress value={Math.min(100, (imcAtual / 40) * 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Inicial: {imcInicial.toFixed(1)}</span>
                    <span>Atual: {imcAtual.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-instituto-orange" />
                  Evolução do Peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="pesoGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="peso" 
                        stroke="#f97316"
                        strokeWidth={3}
                        fill="url(#pesoGradient)"
                        dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#f97316", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gráficos Detalhados */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Composição Corporal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-instituto-orange" />
                  Composição Corporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="gordura" fill="#f59e0b" name="Gordura %" />
                      <Line type="monotone" dataKey="musculo" stroke="#10b981" strokeWidth={3} name="Músculo kg" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Evolução do IMC */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-instituto-orange" />
                  Evolução do IMC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <ReferenceLine y={25} stroke="#10b981" strokeDasharray="3 3" />
                      <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="3 3" />
                      <Line 
                        type="monotone" 
                        dataKey="imc" 
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#8b5cf6", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conquistas */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conquistas.map((conquista) => (
              <Card key={conquista.id} className={`transition-all duration-300 hover:scale-105 ${
                conquista.desbloqueada 
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{conquista.icon}</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    conquista.desbloqueada ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {conquista.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {conquista.descricao}
                  </p>
                  <div className="space-y-2">
                    <Progress 
                      value={conquista.progresso} 
                      className="h-2"
                      style={{
                        backgroundColor: conquista.desbloqueada ? '#10b981' : '#e5e7eb'
                      }}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progresso</span>
                      <span className="font-medium">{conquista.progresso.toFixed(0)}%</span>
                    </div>
                  </div>
                  {conquista.desbloqueada && (
                    <Badge className="mt-3 bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Conquistado!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Análise */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análise de Saúde */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-instituto-orange" />
                  Análise de Saúde
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Status Atual</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {classificacaoIMC.categoria}
                  </p>
                  <p className="text-sm text-blue-600">
                    IMC: {imcAtual.toFixed(1)}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Recomendações</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">Continue com a dieta balanceada</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">Mantenha exercícios 3x por semana</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">Hidratação adequada (2-3L/dia)</span>
                    </div>
                  </div>
                </div>

                {imcAtual > 30 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Atenção</h4>
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">IMC elevado - foco na redução de peso</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Próximos Marcos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-instituto-orange" />
                  Próximos Marcos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Meta de Peso</span>
                      <Badge variant="outline">
                        {progressoMeta.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={progressoMeta} className="h-2 mb-2" />
                    <div className="text-sm text-gray-600">
                      Próximo marco: {(clienteEdmundo.pesoAtual - 2).toFixed(1)}kg
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Redução de Gordura</span>
                      <Badge variant="outline">
                        {((dadosEvolucao[0].gordura - dadosEvolucao[dadosEvolucao.length - 1].gordura) / 3 * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={Math.min(100, ((dadosEvolucao[0].gordura - dadosEvolucao[dadosEvolucao.length - 1].gordura) / 3) * 100)} className="h-2 mb-2" />
                    <div className="text-sm text-gray-600">
                      Próximo marco: {(dadosEvolucao[dadosEvolucao.length - 1].gordura - 1).toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Circunferência Abdominal</span>
                      <Badge variant="outline">
                        {((dadosEvolucao[0].circunferencia - dadosEvolucao[dadosEvolucao.length - 1].circunferencia) / 5 * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={Math.min(100, ((dadosEvolucao[0].circunferencia - dadosEvolucao[dadosEvolucao.length - 1].circunferencia) / 5) * 100)} className="h-2 mb-2" />
                    <div className="text-sm text-gray-600">
                      Próximo marco: {(dadosEvolucao[dadosEvolucao.length - 1].circunferencia - 1).toFixed(0)}cm
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 