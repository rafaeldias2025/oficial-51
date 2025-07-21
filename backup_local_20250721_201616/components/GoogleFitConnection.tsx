import React, { useState, useEffect } from 'react';
import { googleFitService } from '@/services/googleFitService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, Wifi, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GoogleFitConnectionProps {
  userId: string;
  onSuccess?: () => void;
}

export const GoogleFitConnection: React.FC<GoogleFitConnectionProps> = ({ 
  userId, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se já está conectado
    const isAlreadyConnected = googleFitService.isConnected();
    setIsConnected(isAlreadyConnected);
    
    if (isAlreadyConnected) {
      const email = localStorage.getItem('google_fit_email');
      setConnectedEmail(email);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const accessToken = await googleFitService.authenticateUser();
      const email = localStorage.getItem('google_fit_email');
      
      setIsConnected(true);
      setConnectedEmail(email);
      
      toast({
        title: "Conectado com sucesso!",
        description: `Conta Google conectada: ${email}`,
      });
      
      onSuccess?.();
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao conectar com Google Fit. Tente novamente.';
      setError(errorMessage);
      
      toast({
        title: "Erro na conexão",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Erro na conexão:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      
      await googleFitService.syncAllData(userId);
      
      toast({
        title: "Dados sincronizados!",
        description: "Seus dados do Google Fit foram importados com sucesso.",
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao sincronizar dados. Verifique sua conexão.';
      setError(errorMessage);
      
      toast({
        title: "Erro na sincronização",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Erro na sincronização:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    googleFitService.disconnect();
    setIsConnected(false);
    setConnectedEmail(null);
    setError(null);
    
    toast({
      title: "Desconectado",
      description: "Google Fit foi desconectado.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Google Fit
          </div>
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-300'
          }`} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Conecte sua conta Google para sincronizar dados de saúde e fitness automaticamente.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Dados sincronizados:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Passos diários
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Peso corporal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Frequência cardíaca
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Calorias queimadas
                </li>
              </ul>
            </div>
            
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Wifi className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Conectar Google Fit
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Conectado ao Google Fit
                </p>
                <p className="text-xs text-green-600">
                  {connectedEmail}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1"
              >
                {isSyncing ? (
                  <>
                    <Wifi className="w-4 h-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Sincronizar Dados
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleDisconnect}
                variant="outline"
              >
                Desconectar
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p><strong>Última sincronização:</strong> Clique em "Sincronizar Dados" para atualizar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};