import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Wifi,
  Shield
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { googleFitService } from '@/services/googleFitService';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export const GoogleFitTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = () => {
    const connected = googleFitService.isConnected();
    setIsConnected(connected);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const testResults: TestResult[] = [];

    try {
      // Teste 1: Verificar se o Google API está disponível
      testResults.push({
        name: 'Google API Disponível',
        status: 'pending',
        message: 'Verificando...'
      });

      try {
        await googleFitService.initializeGoogleAPI();
        testResults[0] = {
          name: 'Google API Disponível',
          status: 'success',
          message: 'Google API carregada com sucesso'
        };
      } catch (error) {
        testResults[0] = {
          name: 'Google API Disponível',
          status: 'error',
          message: 'Falha ao carregar Google API',
          details: error.message
        };
      }

      // Teste 2: Verificar conexão atual
      testResults.push({
        name: 'Status da Conexão',
        status: 'pending',
        message: 'Verificando...'
      });

      const connected = googleFitService.isConnected();
      if (connected) {
        const isValid = await googleFitService.validateToken();
        testResults[1] = {
          name: 'Status da Conexão',
          status: isValid ? 'success' : 'error',
          message: isValid ? 'Token válido e conectado' : 'Token expirado ou inválido'
        };
      } else {
        testResults[1] = {
          name: 'Status da Conexão',
          status: 'error',
          message: 'Não conectado ao Google Fit'
        };
      }

      // Teste 3: Verificar tabelas do banco
      testResults.push({
        name: 'Tabelas do Banco',
        status: 'pending',
        message: 'Verificando...'
      });

      try {
        const { data: credentials, error: credError } = await supabase
          .from('user_google_credentials')
          .select('count')
          .limit(1);

        const { data: fitData, error: dataError } = await supabase
          .from('google_fit_data')
          .select('count')
          .limit(1);

        if (credError || dataError) {
          testResults[2] = {
            name: 'Tabelas do Banco',
            status: 'error',
            message: 'Erro ao acessar tabelas',
            details: { credError, dataError }
          };
        } else {
          testResults[2] = {
            name: 'Tabelas do Banco',
            status: 'success',
            message: 'Tabelas acessíveis'
          };
        }
      } catch (error) {
        testResults[2] = {
          name: 'Tabelas do Banco',
          status: 'error',
          message: 'Falha na conexão com banco',
          details: error.message
        };
      }

      // Teste 4: Testar sincronização (se conectado)
      if (connected) {
        testResults.push({
          name: 'Sincronização de Dados',
          status: 'pending',
          message: 'Testando...'
        });

        try {
          // Usar um userId de teste
          const testUserId = 'test-user-id';
          await googleFitService.syncAllData(testUserId, 1);
          
          testResults[3] = {
            name: 'Sincronização de Dados',
            status: 'success',
            message: 'Sincronização bem-sucedida'
          };
        } catch (error) {
          testResults[3] = {
            name: 'Sincronização de Dados',
            status: 'error',
            message: 'Erro na sincronização',
            details: error.message
          };
        }
      }

      setResults(testResults);

      // Verificar se todos os testes passaram
      const allPassed = testResults.every(result => result.status === 'success');
      
      if (allPassed) {
        toast({
          title: "✅ Todos os testes passaram!",
          description: "A integração Google Fit está funcionando perfeitamente",
        });
      } else {
        const errorCount = testResults.filter(r => r.status === 'error').length;
        toast({
          title: `⚠️ ${errorCount} teste(s) falharam`,
          description: "Verifique os detalhes abaixo",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Erro durante os testes:', error);
      toast({
        title: "❌ Erro nos testes",
        description: "Ocorreu um erro durante a execução dos testes",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Teste de Integração Google Fit
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Este teste verifica todos os componentes da integração Google Fit para garantir 
            que está funcionando 100%. Execute após configurar as credenciais.
          </AlertDescription>
        </Alert>

        <Button
          onClick={runTests}
          disabled={isRunning}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Executando Testes...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Executar Testes Completos
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Resultados dos Testes:</h4>
            
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                </div>
                <p className="text-sm mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer">Ver detalhes</summary>
                    <pre className="text-xs mt-1 bg-black/10 p-2 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">✅ O que é testado:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Carregamento da Google API</li>
              <li>• Status da conexão OAuth</li>
              <li>• Validação do token de acesso</li>
              <li>• Acesso às tabelas do banco</li>
              <li>• Sincronização de dados</li>
            </ul>
          </div>
          
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <h5 className="font-medium text-orange-800 mb-2">⚠️ Pré-requisitos:</h5>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Credenciais Google configuradas</li>
              <li>• Domínio autorizado no Google Cloud</li>
              <li>• Tabelas do banco criadas</li>
              <li>• Usuário autenticado</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 