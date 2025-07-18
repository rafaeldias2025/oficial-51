import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Chrome, 
  Key, 
  Shield, 
  Check, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const GoogleFitConfiguration: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const currentDomain = window.location.origin;

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      // Verificar se as credenciais estão configuradas no Supabase
      const { data, error } = await supabase.functions.invoke('check-google-credentials');
      if (!error && data?.configured) {
        setIsConfigured(true);
      }
    } catch (error) {
      console.log('Credenciais não configuradas ainda');
    }
  };

  const handleConfigureWithLovable = () => {
    toast({
      title: "Configure via Lovable Secrets",
      description: "Use o botão abaixo para configurar de forma segura",
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-google-fit-connection');
      
      if (error) throw error;
      
      toast({
        title: "✅ Conexão bem-sucedida!",
        description: "Google Fit está funcionando corretamente",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na conexão",
        description: "Verifique as credenciais configuradas",
        variant: "destructive",
      });
    }
    setIsTestingConnection(false);
  };

  const handleClearCredentials = async () => {
    setIsLoading(true);
    try {
      await supabase.functions.invoke('clear-google-credentials');
      setIsConfigured(false);
      
      toast({
        title: "Credenciais removidas",
        description: "Configuração do Google Fit limpa",
      });
    } catch (error) {
      toast({
        title: "Erro ao limpar",
        description: "Não foi possível limpar as credenciais",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Chrome className="h-5 w-5" />
            Configuração Google Fit
            {isConfigured && (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Configurado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfigured && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-blue-700">
                <strong>✨ Configure via Lovable Secrets (Recomendado)</strong><br/>
                Use o sistema de secrets da Lovable para uma configuração mais segura e fácil.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">🔐 Configuração Segura via Lovable</h4>
              <p className="text-sm text-blue-700 mb-3">
                Configure suas credenciais do Google de forma segura usando o sistema de secrets da Lovable.
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">Google Client ID</p>
                  <p className="text-xs text-blue-600 mb-2">ID do cliente OAuth 2.0 do Google Cloud Console</p>
                  <Button 
                    onClick={handleConfigureWithLovable}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Configurar GOOGLE_CLIENT_ID
                  </Button>
                </div>
                
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">Google Client Secret (opcional)</p>
                  <p className="text-xs text-blue-600 mb-2">Secret do cliente OAuth 2.0 (opcional para alguns fluxos)</p>
                  <Button 
                    onClick={handleConfigureWithLovable}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Configurar GOOGLE_CLIENT_SECRET
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isConfigured && (
                <>
                  <Button 
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isTestingConnection ? 'Testando...' : 'Testar Conexão'}
                  </Button>
                  
                  <Button 
                    onClick={handleClearCredentials}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Limpando...' : 'Limpar Configuração'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções de configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração no Google Cloud Console
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">1</span>
              <span className="text-sm">Acesse o Google Cloud Console</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Abrir
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">2</span>
              <span className="text-sm">Vá em "APIs & Services" → "Credentials"</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">3</span>
              <span className="text-sm">Crie ou edite um OAuth 2.0 Client ID</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">4. Configure os domínios autorizados:</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Desenvolvimento:</span>
                  <code className="text-xs bg-white px-2 py-1 rounded border">http://localhost:3000</code>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Preview atual:</span>
                  <code className="text-xs bg-white px-2 py-1 rounded border flex-1">{currentDomain}</code>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Produção:</span>
                  <code className="text-xs bg-white px-2 py-1 rounded border">https://seu-dominio-producao.com</code>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">5</span>
              <span className="text-sm">Ative as APIs necessárias: Fitness API, People API</span>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-blue-700">
              <strong>💡 Dica:</strong> Após configurar no Google Cloud Console, use o sistema de secrets 
              da Lovable acima para uma configuração mais segura e automatizada.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Status da integração */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Credenciais configuradas</span>
              <Badge variant={isConfigured ? "default" : "secondary"}>
                {isConfigured ? "Sim" : "Não"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Tipo de integração</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Lovable + Google API
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">APIs habilitadas</span>
              <Badge variant="outline">
                Google Fit API
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};