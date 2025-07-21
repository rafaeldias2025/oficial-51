import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProgressData } from '@/hooks/useProgressData';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente ModernChart simplificado para teste
const TestModernChart = ({ data, type, title, dataKey, color, subtitle }) => {
  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              fill={`url(#${dataKey}Gradient)`}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color, strokeWidth: 2 }}
            />
          </AreaChart>
        );
      
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6 relative group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const TestProgress: React.FC = () => {
  const { user } = useAuth();
  const { pesagens, dadosFisicos, loading, error } = useProgressData();
  const [testResult, setTestResult] = React.useState<any>(null);

  // Dados de teste para gráfico
  const testChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Abr', value: 278 },
    { name: 'Mai', value: 189 },
    { name: 'Jun', value: 239 },
  ];

  // Dados para gráfico de pizza
  const pieData = [
    { name: 'Gordura', value: 25, color: '#ff6b6b' },
    { name: 'Músculo', value: 35, color: '#4ecdc4' },
    { name: 'Água', value: 40, color: '#45b7d1' },
  ];

  // Processar dados reais para gráfico
  const processedChartData = pesagens?.slice(0, 10).reverse().map(pesagem => {
    const altura = dadosFisicos?.altura_cm || 170;
    const imc = pesagem.peso_kg / Math.pow(altura / 100, 2);
    
    return {
      data: format(new Date(pesagem.data_medicao), 'dd/MM'),
      peso: pesagem.peso_kg,
      imc: Math.round(imc * 10) / 10,
      gordura: pesagem.gordura_corporal_pct || 0,
      musculo: pesagem.massa_muscular_kg || 0,
      agua: pesagem.agua_corporal_pct || 0,
      circunferencia: pesagem.circunferencia_abdominal_cm || 0,
      data_medicao: pesagem.data_medicao
    };
  }) || [];

  const runTest = async () => {
    if (!user) {
      setTestResult({ error: 'Usuário não autenticado' });
      return;
    }

    try {
      console.log('🧪 Iniciando teste de progresso...');
      
      // Teste 1: Verificar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        setTestResult({ error: `Erro ao buscar perfil: ${profileError.message}` });
        return;
      }

      console.log('✅ Perfil encontrado:', profile);

      // Teste 2: Verificar pesagens
      const { data: pesagensTest, error: pesagensError } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profile.id);

      if (pesagensError) {
        setTestResult({ error: `Erro ao buscar pesagens: ${pesagensError.message}` });
        return;
      }

      console.log('✅ Pesagens encontradas:', pesagensTest?.length || 0);

      // Teste 3: Verificar dados físicos
      const { data: dadosFisicosTest, error: dadosFisicosError } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profile.id);

      if (dadosFisicosError) {
        setTestResult({ error: `Erro ao buscar dados físicos: ${dadosFisicosError.message}` });
        return;
      }

      console.log('✅ Dados físicos encontrados:', !!dadosFisicosTest);

      setTestResult({
        success: true,
        profile: profile,
        pesagens: pesagensTest?.length || 0,
        dadosFisicos: !!dadosFisicosTest,
        user: {
          id: user.id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setTestResult({ error: `Erro geral: ${error}` });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Progresso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Status Atual:</h3>
            <div className="text-sm space-y-1">
              <p>Usuário: {user ? '✅ Autenticado' : '❌ Não autenticado'}</p>
              <p>User ID: {user?.id || 'N/A'}</p>
              <p>Email: {user?.email || 'N/A'}</p>
              <p>Loading: {loading ? '🔄 Sim' : '✅ Não'}</p>
              <p>Error: {error || 'Nenhum'}</p>
              <p>Pesagens: {pesagens?.length || 0}</p>
              <p>Dados Físicos: {dadosFisicos ? '✅ Sim' : '❌ Não'}</p>
            </div>
          </div>

          <Button onClick={runTest} className="w-full">
            Executar Teste Completo
          </Button>

          {testResult && (
            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Resultado do Teste:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teste de Gráfico Simples */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Gráfico Simples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Se você consegue ver este gráfico, o Recharts está funcionando corretamente.
          </p>
        </CardContent>
      </Card>

      {/* Teste de Gráfico com Dados Reais */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Gráfico com Dados Reais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Dados processados: {processedChartData.length} registros
            </p>
            {processedChartData.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Primeiro registro: {JSON.stringify(processedChartData[0])}
              </p>
            )}
          </div>
          
          {processedChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="peso" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Nenhum dado disponível para gráfico</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teste de Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Gráfico de Barras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Teste de Gráfico de Pizza */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Gráfico de Pizza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Teste do ModernChart */}
      {processedChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Teste do ModernChart (Componente do ProgressCharts)</CardTitle>
          </CardHeader>
          <CardContent>
            <TestModernChart
              data={processedChartData}
              type="area"
              title="Evolução do Peso"
              subtitle="Teste do componente ModernChart"
              dataKey="peso"
              color="#3B82F6"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 