import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Globe,
  Key,
  Database
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { googleFitService } from '@/services/googleFitService';

interface DebugInfo {
  clientId: string;
  currentDomain: string;
  authorizedDomains: string[];
  gapiLoaded: boolean;
  auth2Loaded: boolean;
  localStorage: {
    token: boolean;
    email: boolean;
  };
  errors: string[];
}

export const GoogleFitDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkConfiguration = () => {
    setIsLoading(true);
    
    const info: DebugInfo = {
      clientId: '705908448787-p8u2r5kqr1l1ig9509m58q3e8crke7fa.apps.googleusercontent.com',
      currentDomain: window.location.origin,
      authorizedDomains: [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:3000',
        'https://oficial-30.lovable.app',
        'https://oficial-39.lovable.app',
        'https://ac2121bc-ac88-4983-aac4-c3b9ed924c0f.lovableproject.com'
      ],
      gapiLoaded: !!(window as any).gapi,
      auth2Loaded: !!(window as any).gapi?.auth2,
      localStorage: {
        token: !!localStorage.getItem('google_fit_token'),
        email: !!localStorage.getItem('google_fit_email')
      },
      errors: []
    };

    // Verificar se o domínio atual está autorizado
    const isDomainAuthorized = info.authorizedDomains.includes(info.currentDomain);
    if (!isDomainAuthorized) {
      info.errors.push(`Domínio atual (${info.currentDomain}) não está na lista de domínios autorizados`);
    }

    // Verificar se o Google API está carregado
    if (!info.gapiLoaded) {
      info.errors.push('Google API não está carregada');
    }

    // Verificar se o Auth2 está disponível
    if (!info.auth2Loaded) {
      info.errors.push('Google Auth2 não está inicializado');
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  const testGoogleAPI = async () => {
    try {
      setIsLoading(true);
      await googleFitService.initializeGoogleAPI();
      toast({
        title: "✅ Google API carregada com sucesso!",
        description: "A API do Google está funcionando corretamente",
      });
      checkConfiguration(); // Re-verificar após teste
    } catch (error: any) {
      toast({
        title: "❌ Erro ao carregar Google API",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('google_fit_token');
    localStorage.removeItem('google_fit_email');
    toast({
      title: "🧹 LocalStorage limpo",
      description: "Tokens do Google Fit removidos",
    });
    checkConfiguration();
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  if (!debugInfo) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Carregando informações de debug...</p>
        </CardContent>
      </Card>
    );
  }

  const hasErrors = debugInfo.errors.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-orange-600" />
          Debug Google Fit
          <Badge variant={hasErrors ? "destructive" : "default"}>
            {hasErrors ? `${debugInfo.errors.length} erro(s)` : "OK"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasErrors && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Problemas identificados:</p>
                <ul className="text-sm space-y-1">
                  {debugInfo.errors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <XCircle className="w-3 h-3" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="w-4 h-4" />
              Configuração
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Client ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {debugInfo.clientId.substring(0, 20)}...
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Domínio Atual:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {debugInfo.currentDomain}
                </span>
              </div>
            </div>
          </div>

          {/* Status da API */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Status da API
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Google API:</span>
                <Badge variant={debugInfo.gapiLoaded ? "default" : "destructive"}>
                  {debugInfo.gapiLoaded ? "✅ Carregada" : "❌ Não carregada"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Auth2:</span>
                <Badge variant={debugInfo.auth2Loaded ? "default" : "destructive"}>
                  {debugInfo.auth2Loaded ? "✅ Inicializado" : "❌ Não inicializado"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* LocalStorage */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Database className="w-4 h-4" />
            LocalStorage
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Token:</span>
              <Badge variant={debugInfo.localStorage.token ? "default" : "secondary"}>
                {debugInfo.localStorage.token ? "✅ Presente" : "❌ Ausente"}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Email:</span>
              <Badge variant={debugInfo.localStorage.email ? "default" : "secondary"}>
                {debugInfo.localStorage.email ? "✅ Presente" : "❌ Ausente"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Domínios Autorizados */}
        <div className="space-y-3">
          <h4 className="font-medium">Domínios Autorizados:</h4>
          <div className="space-y-1">
            {debugInfo.authorizedDomains.map((domain, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {domain}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={testGoogleAPI}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Testar Google API
              </>
            )}
          </Button>
          
          <Button
            onClick={clearLocalStorage}
            variant="outline"
            size="sm"
          >
            <Database className="w-4 h-4 mr-2" />
            Limpar Cache
          </Button>
          
          <Button
            onClick={checkConfiguration}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-verificar
          </Button>
        </div>

        {/* Recomendações */}
        {hasErrors && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Recomendações:</p>
                <ul className="text-sm space-y-1">
                  {debugInfo.errors.includes('Domínio atual') && (
                    <li>• Adicione o domínio atual aos domínios autorizados no Google Cloud Console</li>
                  )}
                  {debugInfo.errors.includes('Google API') && (
                    <li>• Verifique sua conexão com a internet</li>
                  )}
                  {debugInfo.errors.includes('Auth2') && (
                    <li>• Tente recarregar a página</li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 