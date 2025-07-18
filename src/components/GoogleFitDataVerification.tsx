import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Database, Wifi } from 'lucide-react';

interface GoogleFitRecord {
  id: string;
  data_type: string;
  value: number;
  unit: string;
  source: string;
  timestamp: string;
  created_at: string;
}

interface UserCredentials {
  email: string;
  access_token: string;
  expires_at: string;
  created_at: string;
}

export const GoogleFitDataVerification: React.FC = () => {
  const [recentData, setRecentData] = useState<GoogleFitRecord[]>([]);
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVerificationData = async () => {
    setLoading(true);
    
    try {
      // Buscar dados recentes do Google Fit
      const { data: googleFitData, error: dataError } = await supabase
        .from('google_fit_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (dataError) {
        console.error('Erro ao buscar dados:', dataError);
      } else {
        setRecentData(googleFitData || []);
      }

      // Buscar credenciais do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: credData, error: credError } = await supabase
          .from('user_google_credentials')
          .select('*')
          .eq('email', user.email)
          .single();

        if (credError) {
          console.error('Erro ao buscar credenciais:', credError);
        } else {
          setCredentials(credData);
        }
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const getSourceStatus = (source: string) => {
    if (source === 'google_fit_api' || source === 'GOOGLE_FIT_API_REAL') {
      return { 
        status: 'real', 
        color: 'bg-green-500', 
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Dados Reais'
      };
    } else if (source === 'google_fit_simulation' || source === 'google_fit_demo') {
      return { 
        status: 'simulation', 
        color: 'bg-yellow-500', 
        icon: <XCircle className="w-4 h-4" />,
        text: 'Simulação'
      };
    } else {
      return { 
        status: 'unknown', 
        color: 'bg-gray-500', 
        icon: <Database className="w-4 h-4" />,
        text: 'Fonte: ' + source
      };
    }
  };

  const isTokenExpired = (expiresAt: string) => {
    return new Date() > new Date(expiresAt);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Verificação de Dados Google Fit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando informações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status das Credenciais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Status da Conexão Google Fit
          </CardTitle>
        </CardHeader>
        <CardContent>
          {credentials ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Email conectado:</span>
                <Badge variant="outline">{credentials.email}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Token expira em:</span>
                <Badge variant={isTokenExpired(credentials.expires_at) ? "destructive" : "default"}>
                  {new Date(credentials.expires_at).toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Conectado desde:</span>
                <Badge variant="outline">
                  {new Date(credentials.created_at).toLocaleString()}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Token: {credentials.access_token.substring(0, 20)}...
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhuma credencial encontrada</p>
              <p className="text-sm text-muted-foreground">Faça login no Google Fit primeiro</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Dados Recentes (Últimos 10 registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentData.length > 0 ? (
            <div className="space-y-3">
              {recentData.map((record) => {
                const sourceInfo = getSourceStatus(record.source);
                return (
                  <div key={record.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{record.data_type}</Badge>
                        <Badge className={sourceInfo.color}>
                          {sourceInfo.icon}
                          {sourceInfo.text}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(record.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {record.value} {record.unit}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Timestamp: {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhum dado encontrado</p>
              <p className="text-sm text-muted-foreground">Sincronize seus dados primeiro</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão para Atualizar */}
      <div className="flex justify-center">
        <Button onClick={fetchVerificationData} variant="outline">
          <Database className="w-4 h-4 mr-2" />
          Atualizar Verificação
        </Button>
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle>Como Identificar Dados Reais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">
              <CheckCircle className="w-4 h-4" />
              Dados Reais
            </Badge>
            <span className="text-sm">Source: "google_fit_api" - Dados obtidos da API oficial do Google Fit</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500">
              <XCircle className="w-4 h-4" />
              Simulação
            </Badge>
            <span className="text-sm">Source: "google_fit_simulation" - Dados fictícios para demonstração</span>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Para garantir dados 100% reais, verifique se:
              <br />• Você tem credenciais salvas e válidas
              <br />• O source dos dados é "google_fit_api"
              <br />• O token não está expirado
              <br />• Os valores correspondem aos seus dados reais no Google Fit
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};