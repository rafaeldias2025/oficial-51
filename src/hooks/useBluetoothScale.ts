// ====================================================================
// HOOK CONSOLIDADO PARA BALANÇA BLUETOOTH - XIAOMI MI BODY SCALE 2
// Baseado no protocolo real da Xiaomi Mi Body Composition Scale 2
// ====================================================================

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// Declarações globais para Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: any): Promise<any>;
    };
  }
}

// Tipos específicos para Xiaomi Mi Body Scale 2
export interface ScaleReading {
  weight: number;
  impedance?: number;
  timestamp: Date;
  bodyFat?: number;
  bodyWater?: number;
  muscleMass?: number;
  visceralFat?: number;
  basalMetabolism?: number;
  bodyAge?: number;
  bodyType?: string;
  isStabilized: boolean;
  hasImpedance: boolean;
}

export interface BluetoothScaleState {
  isConnected: boolean;
  isConnecting: boolean;
  isReading: boolean;
  device: any;
  lastReading: ScaleReading | null;
  countdown: number;
  status: string;
}

export interface BluetoothRequestOptions {
  filters: Array<{
    namePrefix?: string;
    name?: string;
    services?: string[];
  }>;
  optionalServices?: string[];
}

interface UseBluetoothScaleReturn {
  // Estado
  state: BluetoothScaleState;
  
  // Ações
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
  startReading: (userHeight?: number, userAge?: number, isMale?: boolean) => Promise<void>;
  stopReading: () => void;
  
  // Utilitários
  calculateBodyComposition: (weight: number, impedance: number, height: number, age: number, isMale: boolean) => Partial<ScaleReading>;
  parseScaleData: (data: DataView, userHeight?: number, userAge?: number, isMale?: boolean) => ScaleReading | null;
}

// UUIDs específicos da Xiaomi Mi Body Scale 2
const XIAOMI_SERVICE_UUID = '0000181d-0000-1000-8000-00805f9b34fb'; // Weight Scale Service
const XIAOMI_CHARACTERISTIC_UUID = '00002a9d-0000-1000-8000-00805f9b34fb'; // Weight Measurement
const XIAOMI_BODY_COMPOSITION_SERVICE = '0000181b-0000-1000-8000-00805f9b34fb'; // Body Composition Service
const XIAOMI_BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb'; // Battery Service

export const useBluetoothScale = (): UseBluetoothScaleReturn => {
  const [state, setState] = useState<BluetoothScaleState>({
    isConnected: false,
    isConnecting: false,
    isReading: false,
    device: null,
    lastReading: null,
    countdown: 0,
    status: 'Desconectado'
  });

  const characteristicRef = useRef<any>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fórmulas para cálculo de composição corporal baseado em impedância (Xiaomi)
  const calculateBodyComposition = useCallback((
    weight: number,
    impedance: number,
    height: number,
    age: number,
    isMale: boolean
  ): Partial<ScaleReading> => {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    let bodyFat: number;
    let bodyWater: number;
    let muscleMass: number;
    let visceralFat: number;
    let basalMetabolism: number;
    let bodyAge: number;

    // Algoritmo específico da Xiaomi Mi Body Scale 2
    if (isMale) {
      // Fórmula para homens baseada no protocolo Xiaomi
      bodyFat = Math.max(5, Math.min(50, (1.2 * bmi) + (0.23 * age) - (10.8 * 1) - 5.4 + (impedance * 0.01)));
      bodyWater = Math.max(35, Math.min(75, (2.447 - (0.09156 * age) + (0.1074 * height) + (0.3362 * weight)) - (bodyFat * 0.35)));
      muscleMass = Math.max(weight * 0.25, Math.min(weight * 0.6, weight - (weight * bodyFat / 100) - (weight * 0.12)));
      basalMetabolism = Math.round((13.397 * weight) + (4.799 * height) - (5.677 * age) + 88.362);
    } else {
      // Fórmula para mulheres baseada no protocolo Xiaomi
      bodyFat = Math.max(5, Math.min(50, (1.2 * bmi) + (0.23 * age) - (10.8 * 0) - 5.4 + (impedance * 0.01)));
      bodyWater = Math.max(35, Math.min(75, (2.097 + (0.1069 * height) + (0.2466 * weight)) - (bodyFat * 0.35)));
      muscleMass = Math.max(weight * 0.25, Math.min(weight * 0.6, weight - (weight * bodyFat / 100) - (weight * 0.12)));
      basalMetabolism = Math.round((9.247 * weight) + (3.098 * height) - (4.330 * age) + 447.593);
    }

    // Gordura visceral baseada na gordura corporal
    visceralFat = Math.max(1, Math.min(30, Math.round(bodyFat / 3)));
    
    // Idade corporal baseada na composição
    const healthScore = (bodyWater / 65) * 0.3 + (1 - (bodyFat / 25)) * 0.4 + (muscleMass / (weight * 0.45)) * 0.3;
    bodyAge = Math.max(18, Math.min(80, Math.round(age + (1 - healthScore) * 15)));

    return {
      bodyFat: Math.round(bodyFat * 10) / 10,
      bodyWater: Math.round(bodyWater * 10) / 10,
      muscleMass: Math.round(muscleMass * 100) / 100,
      visceralFat: Math.round(visceralFat),
      basalMetabolism: Math.round(basalMetabolism),
      bodyAge,
      bodyType: bodyFat < 15 ? 'Atlético' : bodyFat < 25 ? 'Normal' : 'Acima do ideal'
    };
  }, []);

  // Parser otimizado para dados da Xiaomi Mi Body Scale 2
  const parseScaleData = useCallback((
    data: DataView,
    userHeight: number = 170,
    userAge: number = 30,
    isMale: boolean = true
  ): ScaleReading | null => {
    try {
      console.log('📊 Dados brutos Xiaomi recebidos:', Array.from(new Uint8Array(data.buffer)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      if (data.byteLength < 8) {
        console.log('❌ Dados insuficientes:', data.byteLength, 'bytes');
        return null;
      }

      // Protocolo Xiaomi Mi Body Scale 2
      // Estrutura: [Flags][Peso][Impedância][Timestamp][Dados extras]
      
      // Byte 0: Flags de controle
      const controlByte = data.getUint8(0);
      const hasWeight = (controlByte & 0x01) !== 0;
      const isStabilized = (controlByte & 0x02) !== 0;
      const hasImpedance = (controlByte & 0x04) !== 0;
      const hasBodyComposition = (controlByte & 0x08) !== 0;

      console.log('🔍 Flags Xiaomi:', {
        controlByte: controlByte.toString(16),
        hasWeight,
        isStabilized,
        hasImpedance,
        hasBodyComposition
      });

      if (!hasWeight) {
        console.log('⏳ Aguardando dados de peso...');
        return null;
      }

      // Extrair peso dos bytes 1-2 (little endian)
      const rawWeight = data.getUint16(1, true);
      const weight = rawWeight / 200.0; // Divisor para Xiaomi Mi Body Scale 2

      console.log('⚖️ Peso Xiaomi:', weight, 'kg');

      // Validar peso
      if (weight < 5 || weight > 300 || isNaN(weight)) {
        console.log('❌ Peso inválido:', weight);
        return null;
      }

      let bodyComposition: Partial<ScaleReading> = {};

      // Extrair impedância se disponível (bytes 3-4)
      if (hasImpedance && data.byteLength >= 5) {
        const rawImpedance = data.getUint16(3, true);
        const impedance = rawImpedance;
        
        console.log('🔬 Impedância Xiaomi:', impedance);
        
        // Calcular composição corporal
        bodyComposition = calculateBodyComposition(weight, impedance, userHeight, userAge, isMale);
      }

      return {
        weight: Math.round(weight * 10) / 10,
        impedance: bodyComposition.bodyFat ? data.getUint16(3, true) : undefined,
        timestamp: new Date(),
        isStabilized,
        hasImpedance,
        ...bodyComposition
      };

    } catch (error) {
      console.error('Erro ao analisar dados da Xiaomi:', error);
      return null;
    }
  }, [calculateBodyComposition]);

  // Conectar dispositivo Xiaomi Mi Body Scale 2
  const connectDevice = useCallback(async () => {
    if (!navigator.bluetooth) {
      toast.error('Bluetooth não suportado neste navegador');
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, status: 'Procurando Xiaomi Mi Body Scale 2...' }));

      const options: BluetoothRequestOptions = {
        filters: [
          { namePrefix: 'MIBCS' }, // Xiaomi Body Composition Scale
          { namePrefix: 'Mi Body Composition Scale' },
          { namePrefix: 'Mi Scale' },
          { namePrefix: 'Xiaomi' },
          { namePrefix: 'MI_SCALE' }
        ],
        optionalServices: [
          XIAOMI_SERVICE_UUID, // Weight Scale Service
          XIAOMI_BODY_COMPOSITION_SERVICE, // Body Composition Service
          XIAOMI_BATTERY_SERVICE, // Battery Service
          '00001530-1212-efde-1523-785feabcd123', // Mi Fitness Service
          'a22116c4-b1b4-4e40-8c71-c1e3e5b0b2b3', // Custom Mi Scale Service
        ]
      };

      const device = await navigator.bluetooth.requestDevice(options);
      
      console.log('🔗 Dispositivo Xiaomi selecionado:', device.name);
      setState(prev => ({ ...prev, device, status: 'Conectando...' }));

      if (!device.gatt) {
        throw new Error('GATT não disponível no dispositivo');
      }

      const server = await device.gatt.connect();
      console.log('✅ Conectado ao servidor GATT Xiaomi');

      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false, 
        status: 'Conectado - Pronto para leitura' 
      }));

      // Event listener para desconexão
      device.addEventListener('gattserverdisconnected', () => {
        console.log('❌ Dispositivo Xiaomi desconectado');
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          device: null, 
          status: 'Desconectado' 
        }));
      });

      toast.success('Xiaomi Mi Body Scale 2 conectada com sucesso!');

    } catch (error) {
      console.error('Erro ao conectar Xiaomi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        status: `Erro: ${errorMessage}` 
      }));
      toast.error(`Erro ao conectar Xiaomi: ${errorMessage}`);
    }
  }, []);

  // Desconectar dispositivo
  const disconnectDevice = useCallback(() => {
    if (state.device?.gatt?.connected) {
      state.device.gatt.disconnect();
    }
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      device: null,
      status: 'Desconectado'
    }));

    if (characteristicRef.current) {
      characteristicRef.current = null;
    }

    toast.info('Xiaomi Mi Body Scale 2 desconectada');
  }, [state.device]);

  // Iniciar leitura
  const startReading = useCallback(async (
    userHeight: number = 170,
    userAge: number = 30,
    isMale: boolean = true
  ) => {
    if (!state.device?.gatt?.connected) {
      toast.error('Xiaomi Mi Body Scale 2 não conectada');
      return;
    }

    try {
      setState(prev => ({ ...prev, isReading: true, status: 'Procurando serviços Xiaomi...' }));

      const server = state.device.gatt;
      const services = await server.getPrimaryServices();
      
      console.log('🔍 Serviços Xiaomi encontrados:', services.length);

      let characteristic: any = null;
      
      // Procurar serviço Xiaomi específico
      for (const service of services) {
        console.log(`Verificando serviço Xiaomi: ${service.uuid}`);
        
        if (service.uuid.toLowerCase() === XIAOMI_SERVICE_UUID.toLowerCase() ||
            service.uuid.toLowerCase() === XIAOMI_BODY_COMPOSITION_SERVICE.toLowerCase()) {
          console.log('✅ Serviço Xiaomi encontrado');
          
          const characteristics = await service.getCharacteristics();
          console.log('Características Xiaomi encontradas:', characteristics.length);
          
          for (const char of characteristics) {
            console.log(`Característica Xiaomi: ${char.uuid}, Propriedades:`, char.properties);
            
            if (char.uuid.toLowerCase() === XIAOMI_CHARACTERISTIC_UUID.toLowerCase() || 
                char.properties.notify || 
                char.properties.indicate) {
              characteristic = char;
              console.log(`✅ Característica Xiaomi encontrada: ${char.uuid}`);
              break;
            }
          }
          
          if (characteristic) break;
        }
      }

      if (!characteristic) {
        throw new Error('Serviço Xiaomi não encontrado');
      }

      setState(prev => ({ ...prev, status: 'Aguardando dados da Xiaomi Mi Body Scale 2...' }));

      // Handler para dados recebidos
      const handleWeightData = (event: any) => {
        const value = event.target.value as DataView;
        
        if (!value || value.byteLength < 4) {
          console.log('Dados insuficientes recebidos da Xiaomi');
          return;
        }
        
        const reading = parseScaleData(value, userHeight, userAge, isMale);
        
        if (reading && reading.isStabilized) {
          console.log('✅ Leitura estável Xiaomi capturada:', reading);
          setState(prev => ({ 
            ...prev, 
            lastReading: reading,
            isReading: false,
            status: 'Peso capturado com sucesso!' 
          }));
          
          characteristic.removeEventListener('characteristicvaluechanged', handleWeightData);
          toast.success(`Peso capturado: ${reading.weight} kg`);
        } else if (reading) {
          console.log('⏳ Aguardando estabilização Xiaomi...');
          setState(prev => ({ 
            ...prev, 
            lastReading: reading,
            status: 'Aguardando estabilização...' 
          }));
        }
      };

      // Configurar notificações
      characteristicRef.current = characteristic;
      characteristic.addEventListener('characteristicvaluechanged', handleWeightData);
      
      if (characteristic.properties.notify) {
        await characteristic.startNotifications();
        console.log('🔔 Notificações Xiaomi ativadas');
      } else if (characteristic.properties.indicate) {
        await characteristic.startIndications();
        console.log('🔔 Indicações Xiaomi ativadas');
      }

      setState(prev => ({ ...prev, status: 'Aguardando medição...' }));

    } catch (error) {
      console.error('Erro ao iniciar leitura Xiaomi:', error);
      setState(prev => ({ 
        ...prev, 
        isReading: false, 
        status: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      }));
      toast.error(`Erro ao iniciar leitura: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, [state.device, parseScaleData]);

  // Parar leitura
  const stopReading = useCallback(() => {
    if (characteristicRef.current) {
      characteristicRef.current.removeEventListener('characteristicvaluechanged', () => {});
      characteristicRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      isReading: false, 
      status: 'Leitura parada' 
    }));

    toast.info('Leitura da Xiaomi Mi Body Scale 2 parada');
  }, []);

  return {
    state,
    connectDevice,
    disconnectDevice,
    startReading,
    stopReading,
    calculateBodyComposition,
    parseScaleData
  };
};