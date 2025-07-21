import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProgressData } from '@/hooks/useProgressData';
import { supabase } from '@/integrations/supabase/client';

export const TestProgress: React.FC = () => {
  const { user } = useAuth();
  const { pesagens, dadosFisicos, loading, error } = useProgressData();
  const [testResult, setTestResult] = React.useState<any>(null);

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
    </div>
  );
}; 