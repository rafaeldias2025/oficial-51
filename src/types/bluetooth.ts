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
}

export interface BluetoothScaleReading extends ScaleReading {}

export interface BluetoothScaleState {
  isConnected: boolean;
  isConnecting: boolean;
  isReading: boolean;
  device: any;
  lastReading: BluetoothScaleReading | null;
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