import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Calendar,
  Clock,
  Smartphone,
  Wifi,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Pesagem = any;
type DadosFisicos = any;
type WeeklyEvaluation = any;

const WeeklyWeighingDemo: React.FC = () => {
  const { user } = useAuth();
  const [pesagens, setPesagens] = useState<Pesagem[]>([]);
  const [dadosFisicos, setDadosFisicos] = useState<DadosFisicos | null>(null);
  const [avaliacoesSemanais, setAvaliacoesSemanais] = useState<WeeklyEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulandoPesagem, setSimulandoPesagem] = useState(false);
  const [pesoSimulado, setPesoSimulado] = useState<number>(70.5);
  const [dispositivoId, setDispositivoId] = useState<string>('openScale-001');

  // Carregar dados
  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Carregar pesagens
      const { data: pesagensData, error: pesagensError } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', user.id)
        .order('data_pesagem', { ascending: false });

      if (pesagensError) throw pesagensError;
      setPesagens(pesagensData || []);

      // Carregar dados físicos
      const { data: dadosFisicosData, error: dadosFisicosError } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (dadosFisicosError && dadosFisicosError.code !== 'PGRST116') throw dadosFisicosError;
      setDadosFisicos(dadosFisicosData);

      // Carregar avaliações semanais
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from('weekly_evaluations')
        .select('*')
        .eq('user_id', user.id)
        .order('semana_inicio', { ascending: false });

      if (avaliacoesError) throw avaliacoesError;
      setAvaliacoesSemanais(avaliacoesData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simular pesagem automática da balança
  const simularPesagemAutomatica = async () => {
    if (!user) return;

    try {
      setSimulandoPesagem(true);

      // Simular delay da balança
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Inserir pesagem automática diretamente
      const { error } = await supabase
        .from('pesagens')
        .insert({
          user_id: user.id,
          peso_kg: pesoSimulado,
          fonte_dados: 'balanca_automatica',
          dispositivo_id: dispositivoId,
          data_pesagem: new Date().toISOString().split('T')[0],
          hora_pesagem: new Date().toTimeString().split(' ')[0]
        });

      if (error) throw error;

      // Recarregar dados
      await carregarDados();

      // Simular variação de peso para próxima pesagem
      setPesoSimulado(prev => prev + (Math.random() - 0.5) * 0.3);

    } catch (error) {
      console.error('Erro ao simular pesagem:', error);
    } finally {
      setSimulandoPesagem(false);
    }
  };

  // Inserir pesagem manual
  const inserirPesagemManual = async (peso: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pesagens')
        .insert({
          user_id: user.id,
          peso_kg: peso,
          fonte_dados: 'manual',
          data_pesagem: new Date().toISOString().split('T')[0],
          hora_pesagem: new Date().toTimeString().split(' ')[0]
        });

      if (error) throw error;

      await carregarDados();
    } catch (error) {
      console.error('Erro ao inserir pesagem manual:', error);
    }
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    if (pesagens.length === 0) return null;

    const pesos = pesagens.map(p => p.peso_kg);
    const pesoAtual = pesos[0];
    const pesoInicial = pesos[pesos.length - 1];
    const variacaoTotal = pesoAtual - pesoInicial;
    const variacaoPercentual = ((variacaoTotal / pesoInicial) * 100);

    const pesagensAutomaticas = pesagens.filter(p => p.fonte_dados === 'balanca_automatica').length;
    const pesagensManuais = pesagens.filter(p => p.fonte_dados === 'manual').length;

    return {
      pesoAtual,
      pesoInicial,
      variacaoTotal,
      variacaoPercentual,
      totalPesagens: pesagens.length,
      pesagensAutomaticas,
      pesagensManuais,
      mediaPeso: pesos.reduce((a, b) => a + b, 0) / pesos.length
    };
  };

  const estatisticas = calcularEstatisticas();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados de pesagem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pesagens Semanais</h1>
          <p className="text-muted-foreground">
            Sistema integrado com balança automática openScale
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          openScale Connected
        </Badge>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pesagens">Histórico</TabsTrigger>
          <TabsTrigger value="simulacao">Simulação</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {estatisticas?.pesoAtual?.toFixed(1)} kg
                </div>
                {estatisticas?.variacaoTotal && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    {estatisticas.variacaoTotal > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    {estatisticas.variacaoTotal > 0 ? '+' : ''}
                    {estatisticas.variacaoTotal.toFixed(1)} kg
                    ({estatisticas.variacaoPercentual.toFixed(1)}%)
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pesagens</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas?.totalPesagens || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {estatisticas?.pesagensAutomaticas || 0} automáticas, {estatisticas?.pesagensManuais || 0} manuais
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média Peso</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {estatisticas?.mediaPeso?.toFixed(1)} kg
                </div>
                <div className="text-xs text-muted-foreground">
                  Baseado em {estatisticas?.totalPesagens || 0} medições
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status IMC</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dadosFisicos?.imc?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dadosFisicos?.categoria_imc || 'Não calculado'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Progresso */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Meta semanal</span>
                  <span>-0.5 kg</span>
                </div>
                <Progress value={Math.abs((estatisticas?.variacaoPercentual || 0) / 2)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Início: {estatisticas?.pesoInicial?.toFixed(1)} kg</span>
                  <span>Atual: {estatisticas?.pesoAtual?.toFixed(1)} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Últimas Pesagens */}
          <Card>
            <CardHeader>
              <CardTitle>Últimas Pesagens</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {pesagens.slice(0, 10).map((pesagem) => (
                    <div key={pesagem.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {pesagem.fonte_dados === 'balanca_automatica' ? (
                          <Smartphone className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Scale className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="font-medium">{pesagem.peso_kg} kg</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(pesagem.data_pesagem).toLocaleDateString()}</span>
                        <Clock className="h-3 w-3" />
                        <span>{pesagem.hora_pesagem}</span>
                        {pesagem.sincronizado_com_google_fit && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pesagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Completo de Pesagens</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {pesagens.map((pesagem) => (
                    <div key={pesagem.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="font-bold text-lg">{pesagem.peso_kg} kg</div>
                          <div className="text-xs text-muted-foreground">
                            {pesagem.fonte_dados === 'balanca_automatica' ? 'Automática' : 'Manual'}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(pesagem.data_pesagem).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-muted-foreground">
                            {pesagem.hora_pesagem}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pesagem.dispositivo_id && (
                          <Badge variant="outline" className="text-xs">
                            {pesagem.dispositivo_id}
                          </Badge>
                        )}
                        {pesagem.sincronizado_com_google_fit && (
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            Google Fit
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulação de Pesagem Automática</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    value={pesoSimulado}
                    onChange={(e) => setPesoSimulado(parseFloat(e.target.value) || 0)}
                    placeholder="70.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dispositivo">ID do Dispositivo</Label>
                  <Input
                    id="dispositivo"
                    value={dispositivoId}
                    onChange={(e) => setDispositivoId(e.target.value)}
                    placeholder="openScale-001"
                  />
                </div>
              </div>

              <Button 
                onClick={simularPesagemAutomatica}
                disabled={simulandoPesagem}
                className="w-full"
              >
                {simulandoPesagem ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin mr-2" />
                    Simulando pesagem...
                  </>
                ) : (
                  <>
                    <Scale className="h-4 w-4 mr-2" />
                    Simular Pesagem Automática
                  </>
                )}
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Como funciona:</p>
                    <ul className="text-blue-700 mt-1 space-y-1">
                      <li>• A balança openScale envia dados automaticamente</li>
                      <li>• O sistema registra peso, data, hora e dispositivo</li>
                      <li>• Dados são sincronizados com Google Fit (se configurado)</li>
                      <li>• Histórico completo é mantido para análise</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pesagem Manual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[70.0, 70.5, 71.0, 71.5, 72.0, 72.5].map((peso) => (
                    <Button
                      key={peso}
                      variant="outline"
                      onClick={() => inserirPesagemManual(peso)}
                      className="h-12"
                    >
                      {peso} kg
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Clique em um peso para inserir uma pesagem manual
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Balança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status da Conexão</Label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Conectado ao openScale</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dispositivo Ativo</Label>
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">{dispositivoId}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sincronização Google Fit</Label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pendente de configuração</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Frequência de Pesagem</Label>
                <div className="text-sm text-muted-foreground">
                  Recomendado: 1x por semana
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyWeighingDemo; 