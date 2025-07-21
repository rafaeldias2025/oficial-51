import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBluetoothScale } from '@/hooks/useBluetoothScale';
import {
  Bluetooth,
  Scale,
  CheckCircle,
  X,
  Loader,
  AlertCircle,
  Wifi,
  Timer
} from 'lucide-react';

export const BluetoothScaleTest: React.FC = () => {
  const {
    state,
    connectDevice,
    disconnectDevice,
    startReading,
    stopReading
  } = useBluetoothScale();

  const {
    isConnected,
    isConnecting,
    isReading,
    device,
    lastReading,
    status
  } = state;

  const getStatusIcon = () => {
    if (isConnecting) return <Loader className="h-4 w-4 animate-spin" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-blue-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Teste Xiaomi Mi Body Scale 2
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {status}
            </span>
          </div>
          {device && (
            <Badge variant="secondary" className="text-xs">
              {device.name}
            </Badge>
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              onClick={connectDevice}
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Bluetooth className="mr-2 h-4 w-4" />
                  Conectar Xiaomi
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => startReading()}
                disabled={isReading}
                className="flex-1"
              >
                {isReading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Lendo...
                  </>
                ) : (
                  <>
                    <Scale className="mr-2 h-4 w-4" />
                    Iniciar Pesagem
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={disconnectDevice}
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Leitura */}
        {lastReading && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">Última Leitura</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Peso:</span>
                <span className="font-bold text-lg">{lastReading.weight} kg</span>
              </div>
              {lastReading.bodyFat && (
                <div className="flex justify-between">
                  <span className="text-sm">Gordura:</span>
                  <span className="font-semibold">{lastReading.bodyFat}%</span>
                </div>
              )}
              {lastReading.muscleMass && (
                <div className="flex justify-between">
                  <span className="text-sm">Músculo:</span>
                  <span className="font-semibold">{lastReading.muscleMass} kg</span>
                </div>
              )}
              {lastReading.bodyWater && (
                <div className="flex justify-between">
                  <span className="text-sm">Água:</span>
                  <span className="font-semibold">{lastReading.bodyWater}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm">Estável:</span>
                <Badge variant={lastReading.isStabilized ? "default" : "secondary"}>
                  {lastReading.isStabilized ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        {!lastReading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Instruções</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>• Certifique-se que a Xiaomi Mi Body Scale 2 está ligada</p>
              <p>• Mantenha o dispositivo próximo</p>
              <p>• Suba na balança quando solicitado</p>
              <p>• Aguarde a estabilização</p>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <details className="text-xs text-muted-foreground">
          <summary>Debug Info</summary>
          <div className="mt-2 space-y-1">
            <div>Conectado: {isConnected ? 'Sim' : 'Não'}</div>
            <div>Conectando: {isConnecting ? 'Sim' : 'Não'}</div>
            <div>Lendo: {isReading ? 'Sim' : 'Não'}</div>
            <div>Dispositivo: {device?.name || 'Nenhum'}</div>
            <div>Status: {status}</div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}; 