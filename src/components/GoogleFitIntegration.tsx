import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Heart, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleFitData {
  steps?: number;
  heartRate?: number;
  weight?: number;
  lastSync?: string;
}

interface ConnectionStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
}

export const GoogleFitIntegration: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isLoading: false,
    error: null,
    lastSync: null
  });
  const [fitData, setFitData] = useState<GoogleFitData>({});
  const { toast } = useToast();

  // ✅ PERFORMANCE: Memoized function to check connection
  const checkConnection = useCallback(async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call to check Google Fit connection
      const response = await fetch('/api/google-fit/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: data.connected || false,
        lastSync: data.lastSync || null,
        isLoading: false
      }));

      if (data.connected) {
        setFitData({
          steps: data.steps,
          heartRate: data.heartRate,
          weight: data.weight,
          lastSync: data.lastSync
        });
      }
    } catch (error: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao verificar conexão Google Fit:', error);
      }
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error.message || 'Erro ao verificar conexão'
      }));
    }
  }, []);

  // ✅ ENHANCED: Connect to Google Fit with proper error handling
  const connectToGoogleFit = useCallback(async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Check if Google APIs are available
      if (typeof window === 'undefined' || !window.gapi) {
        throw new Error('Google APIs não estão disponíveis');
      }

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        lastSync: new Date().toISOString()
      }));

      toast({
        title: "Conectado com sucesso!",
        description: "Google Fit foi conectado à sua conta.",
      });

      // Fetch initial data after connection
      await checkConnection();
    } catch (error: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao conectar Google Fit:', error);
      }
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error.message || 'Falha na conexão'
      }));

      toast({
        title: "Erro na conexão",
        description: error.message || "Não foi possível conectar com o Google Fit.",
        variant: "destructive",
      });
    }
  }, [toast, checkConnection]);

  // ✅ ENHANCED: Disconnect from Google Fit
  const disconnectFromGoogleFit = useCallback(async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectionStatus({
        isConnected: false,
        isLoading: false,
        error: null,
        lastSync: null
      });
      setFitData({});

      toast({
        title: "Desconectado",
        description: "Google Fit foi desconectado da sua conta.",
      });
    } catch (error: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao desconectar Google Fit:', error);
      }
      
      setConnectionStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro ao desconectar'
      }));
    }
  }, [toast]);

  // ✅ EFFECT: Check connection status on mount only
  useEffect(() => {
    let isMounted = true;
    
    const initializeConnection = async () => {
      if (isMounted) {
        await checkConnection();
      }
    };

    initializeConnection();

    return () => {
      isMounted = false;
    };
  }, []); // Only run on mount

  const getStatusIcon = () => {
    if (connectionStatus.isLoading) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    if (connectionStatus.error) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return connectionStatus.isConnected ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> :
      <WifiOff className="h-5 w-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (connectionStatus.isLoading) return 'Verificando...';
    if (connectionStatus.error) return 'Erro de conexão';
    return connectionStatus.isConnected ? 'Conectado' : 'Desconectado';
  };

  const getStatusColor = () => {
    if (connectionStatus.error) return 'destructive';
    return connectionStatus.isConnected ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Status de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Google Fit Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
              <Badge variant={getStatusColor()}>
                {connectionStatus.isConnected ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {connectionStatus.isConnected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkConnection}
                    disabled={connectionStatus.isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus.isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={disconnectFromGoogleFit}
                    disabled={connectionStatus.isLoading}
                  >
                    <WifiOff className="h-4 w-4 mr-2" />
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={connectToGoogleFit}
                  disabled={connectionStatus.isLoading}
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              )}
            </div>
          </div>

          {connectionStatus.lastSync && (
            <p className="text-sm text-muted-foreground">
              Última sincronização: {new Date(connectionStatus.lastSync).toLocaleString('pt-BR')}
            </p>
          )}

          {connectionStatus.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {connectionStatus.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dados do Google Fit */}
      {connectionStatus.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Dados de Saúde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Passos</p>
                  <p className="text-2xl font-bold">{fitData.steps?.toLocaleString() || '0'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Freq. Cardíaca</p>
                  <p className="text-2xl font-bold">{fitData.heartRate || '--'} bpm</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Activity className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="text-2xl font-bold">{fitData.weight?.toFixed(1) || '--'} kg</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};