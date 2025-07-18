// ====================================================================
// HOOK CONSOLIDADO PARA BALANÇA BLUETOOTH
// Este arquivo substitui useBluetoothScale.tsx, que deve ser removido.
// Todas as funcionalidades foram migradas para esta versão.
// ====================================================================

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { BluetoothScaleReading, BluetoothScaleState, BluetoothRequestOptions } from '@/types/bluetooth';

// Declarações globais para Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: any): Promise<any>;
    };
  }
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
  calculateBodyComposition: (weight: number, impedance: number, height: number, age: number, isMale: boolean) => Partial<BluetoothScaleReading>;
  parseScaleData: (data: DataView, userHeight?: number, userAge?: number, isMale?: boolean) => BluetoothScaleReading | null;
}

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

  // Fórmulas para cálculo de composição corporal baseado em impedância
  const calculateBodyComposition = useCallback((
    weight: number,
    impedance: number,
    height: number,
    age: number,
    isMale: boolean
  ): Partial<BluetoothScaleReading> => {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    let bodyFat: number;
    let bodyWater: number;
    let muscleMass: number;
    let visceralFat: number;
    let basalMetabolism: number;
    let bodyAge: number;

    if (isMale) {
      bodyFat = (1.2 * bmi) + (0.23 * age) - (10.8 * 1) - 5.4 + (impedance * 0.01);
      bodyWater = (2.447 - (0.09156 * age) + (0.1074 * height) + (0.3362 * weight)) - (bodyFat * 0.35);
      muscleMass = weight - (weight * bodyFat / 100) - (weight * 0.15);
      basalMetabolism = (13.397 * weight) + (4.799 * height) - (5.677 * age) + 88.362;
    } else {
      bodyFat = (1.2 * bmi) + (0.23 * age) - (10.8 * 0) - 5.4 + (impedance * 0.01);
      bodyWater = (2.097 + (0.1069 * height) + (0.2466 * weight)) - (bodyFat * 0.35);
      muscleMass = weight - (weight * bodyFat / 100) - (weight * 0.12);
      basalMetabolism = (9.247 * weight) + (3.098 * height) - (4.330 * age) + 447.593;
    }

    // Ajustes baseados nos limites normais
    bodyFat = Math.max(5, Math.min(50, bodyFat));
    bodyWater = Math.max(35, Math.min(75, bodyWater));
    muscleMass = Math.max(weight * 0.25, Math.min(weight * 0.6, muscleMass));
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

  // Parser otimizado para dados da balança
  const parseScaleData = useCallback((
    data: DataView,
    userHeight: number = 170,
    userAge: number = 30,
    isMale: boolean = true
  ): BluetoothScaleReading | null => {
    try {
      console.log('📊 Dados brutos recebidos:', Array.from(new Uint8Array(data.buffer)).map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      if (data.byteLength < 13) {
        console.log('❌ Dados insuficientes:', data.byteLength, 'bytes');
        return null;
      }

      // Verificar flags de controle (byte 0)
      const controlByte = data.getUint8(0);
      const hasWeight = (controlByte & 0x02) !== 0;
      const isStabilized = (controlByte & 0x20) !== 0;
      const hasImpedance = (controlByte & 0x04) !== 0;

      console.log('🔍 Flags de controle:', {
        controlByte: controlByte.toString(16),
        hasWeight,
        isStabilized,
        hasImpedance
      });

      if (!hasWeight || !isStabilized) {
        console.log('⏳ Aguardando estabilização...');
        return null;
      }

      // Extrair peso dos bytes 11-12 (little endian)
      const rawWeight = data.getUint16(11, true);
      const weight = rawWeight / 200.0; // Divisor para Xiaomi Scale 2

      console.log('⚖️ Peso:', weight, 'kg');

      // Validar peso
      if (weight < 5 || weight > 300 || isNaN(weight)) {
        console.log('❌ Peso inválido:', weight);
        return null;
      }

      let bodyComposition: Partial<BluetoothScaleReading> = {};

      // Extrair impedância se disponível (bytes 9-10)
      if (hasImpedance && data.byteLength >= 11) {
        const rawImpedance = data.getUint16(9, true);
        const impedance = rawImpedance;
        
        console.log('🔬 Impedância:', impedance);
        
        // Calcular composição corporal
        bodyComposition = calculateBodyComposition(weight, impedance, userHeight, userAge, isMale);
      }

      return {
        weight: Math.round(weight * 10) / 10,
        impedance: bodyComposition.bodyFat ? data.getUint16(9, true) : undefined,
        timestamp: new Date(),
        ...bodyComposition
      };

    } catch (error) {
      console.error('Erro ao analisar dados da balança:', error);
      return null;
    }
  }, [calculateBodyComposition]);

  // Conectar dispositivo
  const connectDevice = useCallback(async () => {
    if (!navigator.bluetooth) {
      toast.error('Bluetooth não suportado neste navegador');
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, status: 'Procurando dispositivos...' }));

      const options: BluetoothRequestOptions = {
        filters: [{ namePrefix: 'MI_SCALE' }],
        optionalServices: [
          '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
          '00001530-1212-efde-1523-785feabcd123', // Mi Scale Service
          '0000fff0-0000-1000-8000-00805f9b34fb'  // Mi Service
        ]
      };

      const device = await navigator.bluetooth.requestDevice(options);
      
      console.log('🔗 Dispositivo selecionado:', device.name);
      setState(prev => ({ ...prev, device, status: 'Conectando...' }));

      if (!device.gatt) {
        throw new Error('GATT não disponível no dispositivo');
      }

      const server = await device.gatt.connect();
      console.log('✅ Conectado ao servidor GATT');

      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false, 
        status: 'Conectado - Pronto para leitura' 
      }));

      // Event listener para desconexão
      device.addEventListener('gattserverdisconnected', () => {
        console.log('❌ Dispositivo desconectado');
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          device: null, 
          status: 'Desconectado' 
        }));
      });

      toast.success('Balança conectada com sucesso!');

    } catch (error) {
      console.error('Erro ao conectar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        status: `Erro: ${errorMessage}` 
      }));
      toast.error(`Erro ao conectar: ${errorMessage}`);
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

    toast.info('Balança desconectada');
  }, [state.device]);

  // Iniciar leitura
  const startReading = useCallback(async (
    userHeight: number = 170,
    userAge: number = 30,
    isMale: boolean = true
  ) => {
    if (!state.device?.gatt?.connected) {
      toast.error('Balança não conectada');
      return;
    }

    try {
      setState(prev => ({ ...prev, isReading: true, status: 'Procurando serviços...' }));

      const server = state.device.gatt;
      const services = await server.getPrimaryServices();
      
      console.log('🔍 Serviços encontrados:', services.length);

      let characteristic: any = null;
      
      // Lista de UUIDs de características possíveis
      const possibleCharacteristics = [
        '00002a9d-0000-1000-8000-00805f9b34fb', // Weight Measurement
        '00002a9c-0000-1000-8000-00805f9b34fb', // Body Composition Measurement
        '0000fff1-0000-1000-8000-00805f9b34fb', // Mi Scale Data
        '00001531-1212-efde-1523-785feabcd123', // Mi Scale Custom
        '00002a98-0000-1000-8000-00805f9b34fb'  // Weight Scale Feature
      ];

      // Procurar uma característica válida
      for (const service of services) {
        try {
          console.log(`Verificando serviço: ${service.uuid}`);
          const characteristics = await service.getCharacteristics();
          
          for (const char of characteristics) {
            if (possibleCharacteristics.includes(char.uuid) || char.properties.notify) {
              characteristic = char;
              console.log(`✅ Característica encontrada: ${char.uuid}`);
              break;
            }
          }
          
          if (characteristic) break;
        } catch (err) {
          console.log(`Erro ao verificar serviço ${service.uuid}:`, err);
        }
      }

      if (!characteristic) {
        throw new Error('Nenhuma característica compatível encontrada');
      }

      setState(prev => ({ ...prev, status: 'Aguardando dados da balança...' }));

      // Handler para dados recebidos
      const handleWeightData = (event: any) => {
        const value = event.target.value as DataView;
        
        if (!value || value.byteLength < 4) {
          console.log('Dados insuficientes recebidos');
          return;
        }
        
        const reading = parseScaleData(value, userHeight, userAge, isMale);
        
        if (reading) {
          console.log('✅ Leitura válida capturada:', reading);
          setState(prev => ({ 
            ...prev, 
            lastReading: reading,
            isReading: false,
            status: 'Peso capturado com sucesso!' 
          }));
          
          characteristic.removeEventListener('characteristicvaluechanged', handleWeightData);
          toast.success(`Peso capturado: ${reading.weight} kg`);
        }
      };

      // Configurar notificações
      characteristicRef.current = characteristic;
      characteristic.addEventListener('characteristicvaluechanged', handleWeightData);
      
      if (characteristic.properties.notify) {
        await characteristic.startNotifications();
        console.log('🔔 Notificações ativadas');
      }

      setState(prev => ({ ...prev, status: 'Suba na balança para iniciar a medição' }));

      // Timeout de 60 segundos
      readingTimerRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isReading: false, status: 'Tempo esgotado - tente novamente' }));
        characteristic.removeEventListener('characteristicvaluechanged', handleWeightData);
        toast.error('Tempo esgotado. Tente novamente.');
      }, 60000);

    } catch (error) {
      console.error('Erro ao iniciar leitura:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        isReading: false, 
        status: `Erro: ${errorMessage}` 
      }));
      toast.error(`Erro na leitura: ${errorMessage}`);
    }
  }, [state.device, parseScaleData]);

  // Parar leitura
  const stopReading = useCallback(() => {
    setState(prev => ({ ...prev, isReading: false, status: 'Leitura cancelada' }));
    
    if (readingTimerRef.current) {
      clearTimeout(readingTimerRef.current);
      readingTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    toast.info('Leitura cancelada');
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

// Export types
export type { BluetoothScaleReading as ScaleReading, BluetoothScaleState, UseBluetoothScaleReturn };