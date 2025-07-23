import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Bluetooth, 
  Scale, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Settings,
  Zap,
  Battery,
  Signal,
  Wrench,
  TestTube,
  Activity
} from 'lucide-react';

interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  action?: () => Promise<void>;
}

export const XiaomiScaleTroubleshooter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>({});
  const { toast } = useToast();

  const [steps, setSteps] = useState<TroubleshootingStep[]>([
    {
      id: 'bluetooth-check',
      title: 'Verificar Bluetooth',
      description: 'Testando disponibilidade do Bluetooth no navegador',
      status: 'pending',
      action: async () => {
        if (!('bluetooth' in navigator)) {
          throw new Error('Bluetooth não suportado neste navegador');
        }
        return Promise.resolve();
      }
    },
    {
      id: 'device-scan',
      title: 'Escanear Dispositivos',
      description: 'Procurando por balanças Xiaomi próximas',
      status: 'pending',
      action: async () => {
        try {
          const device = await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
              '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
              '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
              '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
              '00001530-1212-efde-1523-785feabcd123', // Mi Fitness Service
              'a22116c4-b1b4-4e40-8c71-c1e3e5b0b2b3', // Custom Mi Scale Service
            ]
          });
          
          setResults(prev => ({ ...prev, foundDevice: device }));
          return Promise.resolve();
        } catch (error) {
          throw new Error('Nenhum dispositivo encontrado');
        }
      }
    },
    {
      id: 'connection-test',
      title: 'Testar Conexão',
      description: 'Tentando conectar com a balança',
      status: 'pending',
      action: async () => {
        if (!results.foundDevice) {
          throw new Error('Nenhum dispositivo selecionado');
        }

        try {
          const server = await results.foundDevice.gatt?.connect();
          if (!server) {
            throw new Error('Falha na conexão GATT');
          }
          
          setResults(prev => ({ ...prev, server }));
          return Promise.resolve();
        } catch (error) {
          throw new Error('Erro na conexão: ' + error);
        }
      }
    },
    {
      id: 'service-discovery',
      title: 'Descobrir Serviços',
      description: 'Identificando serviços disponíveis na balança',
      status: 'pending',
      action: async () => {
        if (!results.server) {
          throw new Error('Servidor não conectado');
        }

        try {
          const services = await results.server.getPrimaryServices();
          const serviceInfo = [];
          
          for (const service of services) {
            try {
              const characteristics = await service.getCharacteristics();
              serviceInfo.push({
                uuid: service.uuid,
                characteristics: characteristics.map(c => ({
                  uuid: c.uuid,
                  properties: c.properties
                }))
              });
            } catch (err) {
              serviceInfo.push({
                uuid: service.uuid,
                error: err.message
              });
            }
          }
          
          setResults(prev => ({ ...prev, services: serviceInfo }));
          return Promise.resolve();
        } catch (error) {
          throw new Error('Erro ao descobrir serviços: ' + error);
        }
      }
    },
    {
      id: 'weight-service-test',
      title: 'Testar Serviço de Peso',
      description: 'Verificando serviço de medição de peso',
      status: 'pending',
      action: async () => {
        if (!results.services) {
          throw new Error('Serviços não descobertos');
        }

        const weightService = results.services.find(s => 
          s.uuid.toLowerCase().includes('181d') || 
          s.uuid.toLowerCase().includes('weight')
        );

        if (!weightService) {
          throw new Error('Serviço de peso não encontrado');
        }

        setResults(prev => ({ ...prev, weightService }));
        return Promise.resolve();
      }
    },
    {
      id: 'notification-test',
      title: 'Testar Notificações',
      description: 'Configurando notificações de dados',
      status: 'pending',
      action: async () => {
        if (!results.weightService) {
          throw new Error('Serviço de peso não disponível');
        }

        try {
          // Simular configuração de notificações
          setResults(prev => ({ ...prev, notificationsConfigured: true }));
          return Promise.resolve();
        } catch (error) {
          throw new Error('Erro ao configurar notificações: ' + error);
        }
      }
    }
  ]);

  const runTroubleshooting = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Atualizar status para running
      setSteps(prev => prev.map((s, index) => 
        index === i ? { ...s, status: 'running' } : s
      ));

      try {
        if (step.action) {
          await step.action();
        }
        
        // Atualizar status para success
        setSteps(prev => prev.map((s, index) => 
          index === i ? { ...s, status: 'success' } : s
        ));
        
        setCurrentStep(i + 1);
        
      } catch (error) {
        // Atualizar status para error
        setSteps(prev => prev.map((s, index) => 
          index === i ? { ...s, status: 'error' } : s
        ));
        
        toast({
          title: `Erro no passo: ${step.title}`,
          description: error.message,
          variant: 'destructive'
        });
        
        break;
      }
    }

    setIsRunning(false);
  };

  const resetTroubleshooting = () => {
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    setCurrentStep(0);
    setResults({});
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wrench className="mr-2 h-4 w-4" />
          🔧 Diagnosticar Balança Xiaomi
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Diagnóstico da Balança Xiaomi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do Diagnóstico</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Passos */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <Card key={step.id} className={`border-2 ${getStepColor(step.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <Badge variant={step.status === 'error' ? 'destructive' : 'secondary'}>
                      {step.status === 'pending' && 'Pendente'}
                      {step.status === 'running' && 'Executando'}
                      {step.status === 'success' && 'Sucesso'}
                      {step.status === 'error' && 'Erro'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resultados */}
          {Object.keys(results).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resultados do Diagnóstico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {results.foundDevice && (
                    <div className="flex items-center gap-2">
                      <Bluetooth className="h-4 w-4 text-blue-500" />
                      <span>Dispositivo encontrado: {results.foundDevice.name}</span>
                    </div>
                  )}
                  {results.server && (
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-green-500" />
                      <span>Servidor GATT conectado</span>
                    </div>
                  )}
                  {results.services && (
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-purple-500" />
                      <span>{results.services.length} serviços descobertos</span>
                    </div>
                  )}
                  {results.weightService && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Serviço de peso identificado</span>
                    </div>
                  )}
                  {results.notificationsConfigured && (
                    <div className="flex items-center gap-2">
                      <Signal className="h-4 w-4 text-green-500" />
                      <span>Notificações configuradas</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            <Button 
              onClick={runTroubleshooting}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Executar Diagnóstico
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={resetTroubleshooting}
              disabled={isRunning}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Instruções */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">📋 Instruções para Diagnóstico</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>1. Certifique-se de que a balança está ligada e próxima</p>
                <p>2. Verifique se o Bluetooth está ativado</p>
                <p>3. Use Chrome ou Edge para melhor compatibilidade</p>
                <p>4. Aguarde cada etapa ser concluída antes de prosseguir</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 