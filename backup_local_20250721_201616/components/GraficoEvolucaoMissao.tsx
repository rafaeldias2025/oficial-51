import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown, Calendar, Target, CheckCircle, Star } from 'lucide-react';

interface DadosPontuacao {
  dataFormatada: string;
  pontos: number;
  data: string;
  categoria?: string;
}

interface EstatisticasEvolucao {
  mediaUltimos7Dias: number;
  melhorDia: { data: string; pontos: number };
  totalPontos: number;
  diasAtivos: number;
  tendencia: 'subindo' | 'descendo' | 'estavel';
}

export const GraficoEvolucaoMissao = () => {
  const [dadosEvolucao, setDadosEvolucao] = useState<DadosPontuacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasEvolucao | null>(null);
  const [periodo, setPeriodo] = useState<7 | 14 | 30>(7);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDadosEvolucao();
    }
  }, [user, periodo]);

  const fetchDadosEvolucao = async () => {
    try {
      const { data, error } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(periodo);

      if (error) {
        console.error('Erro ao buscar dados de evolução:', error);
        return;
      }

      if (data) {
        const dadosFormatados: DadosPontuacao[] = data.map(item => ({
          dataFormatada: new Date(item.created_at).toLocaleDateString('pt-BR'),
          pontos: item.total_pontos_dia || 0,
          data: item.created_at,
          categoria: 'media'
        }));
        setDadosEvolucao(dadosFormatados);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const calcularEstatisticas = (dados: DadosPontuacao[]) => {
    if (dados.length === 0) {
      setEstatisticas(null);
      return;
    }

    const totalPontos = dados.reduce((sum, item) => sum + item.pontos, 0);
    const diasAtivos = dados.filter(item => item.pontos > 0).length;
    const mediaUltimos7Dias = diasAtivos > 0 ? totalPontos / diasAtivos : 0;

    const melhorDia = dados.reduce((melhor, atual) => 
      atual.pontos > melhor.pontos ? atual : melhor
    );

    // Calcular tendência comparando primeira e segunda metade do período
    const metade = Math.floor(dados.length / 2);
    const primeiraMetade = dados.slice(0, metade);
    const segundaMetade = dados.slice(metade);

    const mediaPrimeira = primeiraMetade.reduce((sum, item) => sum + item.pontos, 0) / primeiraMetade.length;
    const mediaSegunda = segundaMetade.reduce((sum, item) => sum + item.pontos, 0) / segundaMetade.length;

    let tendencia: 'subindo' | 'descendo' | 'estavel' = 'estavel';
    const diferenca = mediaSegunda - mediaPrimeira;
    if (diferenca > 2) tendencia = 'subindo';
    else if (diferenca < -2) tendencia = 'descendo';

    setEstatisticas({
      mediaUltimos7Dias,
      melhorDia: {
        data: format(parseISO(melhorDia.data), "dd 'de' MMMM", { locale: ptBR }),
        pontos: melhorDia.pontos
      },
      totalPontos,
      diasAtivos,
      tendencia
    });
  };

  const getTendenciaIcon = () => {
    if (!estatisticas) return null;
    
    switch (estatisticas.tendencia) {
      case 'subindo':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'descendo':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTendenciaTexto = () => {
    if (!estatisticas) return '';
    
    switch (estatisticas.tendencia) {
      case 'subindo':
        return 'Em crescimento';
      case 'descendo':
        return 'Em queda';
      default:
        return 'Estável';
    }
  };

  const getTendenciaColor = () => {
    if (!estatisticas) return 'bg-gray-100 text-gray-800';
    
    switch (estatisticas.tendencia) {
      case 'subindo':
        return 'bg-green-100 text-green-800';
      case 'descendo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-netflix-text-muted text-sm">Pontos Totais</p>
                <div className="text-2xl font-bold text-netflix-red">
                  2,847
                </div>
              </div>
              <div className="p-3 bg-netflix-red/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-netflix-red" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-netflix-text-muted text-sm">Missões Concluídas</p>
                <div className="text-2xl font-bold text-netflix-red">
                  28
                </div>
              </div>
              <div className="p-3 bg-netflix-red/10 rounded-full">
                <CheckCircle className="w-6 h-6 text-netflix-red" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-netflix-text-muted text-sm">Sequência Atual</p>
                <div className="text-2xl font-bold text-netflix-red">
                  12 dias
                </div>
              </div>
              <div className="p-3 bg-netflix-red/10 rounded-full">
                <Star className="w-6 h-6 text-netflix-red" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card className="bg-netflix-card border-netflix-border mb-8">
        <CardHeader>
          <CardTitle className="text-netflix-text">Evolução dos Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosEvolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="dataFormatada" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="pontos" 
                stroke="#E50914" 
                strokeWidth={3}
                dot={{ fill: '#E50914', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#E50914', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Melhor Performance */}
      <Card className="bg-netflix-card border-netflix-border">
        <CardHeader>
          <CardTitle className="text-netflix-text">Melhor Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-netflix-text">Seu melhor dia</h4>
              <p className="text-netflix-text-muted">
                {estatisticas?.melhorDia.data}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-netflix-red">
                {estatisticas?.melhorDia.pontos}
              </div>
              <p className="text-sm text-netflix-text-muted">pontos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};