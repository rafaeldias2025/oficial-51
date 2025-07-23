#!/usr/bin/env node

/**
 * Script para diagnosticar e corrigir problemas da balança Xiaomi
 * Execute: node scripts/fix-xiaomi-scale.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 DIAGNÓSTICO DA BALANÇA XIAOMI');
console.log('=====================================\n');

// Configurações da balança Xiaomi
const XIAOMI_CONFIG = {
  // Filtros de dispositivo
  deviceFilters: [
    { namePrefix: 'MIBCS' },
    { namePrefix: 'Mi Body Composition Scale' },
    { namePrefix: 'Mi Scale' },
    { namePrefix: 'Xiaomi' },
    { namePrefix: 'MI_SCALE' },
    { namePrefix: 'Mi' },
    { namePrefix: 'BCS' }
  ],
  
  // Serviços Bluetooth
  services: [
    '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale Service
    '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
    '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition Service
    '00001530-1212-efde-1523-785feabcd123', // Mi Fitness Service
    'a22116c4-b1b4-4e40-8c71-c1e3e5b0b2b3', // Custom Mi Scale Service
    '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
    '0000180d-0000-1000-8000-00805f9b34fb', // Heart Rate Service
    '0000180e-0000-1000-8000-00805f9b34fb', // Health Thermometer Service
  ],
  
  // Características específicas
  characteristics: [
    '00002a9d-0000-1000-8000-00805f9b34fb', // Weight Measurement
    '00002a19-0000-1000-8000-00805f9b34fb', // Battery Level
    '00002a6d-0000-1000-8000-00805f9b34fb', // Heart Rate Measurement
  ]
};

// Função para verificar sistema
async function checkSystem() {
  console.log('📋 VERIFICANDO SISTEMA...');
  
  try {
    // Verificar se estamos no diretório correto
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('✅ Projeto React/Node.js detectado');
    
    // Verificar dependências
    const dependencies = packageJson.dependencies || {};
    const hasBluetooth = dependencies['@capacitor/bluetooth'] || dependencies['web-bluetooth'];
    
    if (!hasBluetooth) {
      console.log('⚠️  Dependências Bluetooth não encontradas');
      console.log('💡 Instale: npm install @capacitor/bluetooth');
    } else {
      console.log('✅ Dependências Bluetooth encontradas');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erro ao verificar sistema:', error.message);
    return false;
  }
}

// Função para gerar configuração otimizada
function generateOptimizedConfig() {
  console.log('\n⚙️  GERANDO CONFIGURAÇÃO OTIMIZADA...');
  
  const config = {
    bluetooth: {
      requestDevice: {
        acceptAllDevices: true,
        optionalServices: XIAOMI_CONFIG.services
      },
      filters: XIAOMI_CONFIG.deviceFilters,
      characteristics: XIAOMI_CONFIG.characteristics
    },
    xiaomi: {
      protocol: {
        weightDivisor: 200.0,
        impedanceDivisor: 1.0,
        timeout: 10000,
        retryAttempts: 3
      },
      dataFormat: {
        weightBytes: [1, 2],
        impedanceBytes: [3, 4],
        flagsByte: 0,
        timestampBytes: [5, 6, 7, 8]
      }
    }
  };
  
  // Salvar configuração
  const configPath = path.join(__dirname, '../src/config/xiaomi-scale-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Configuração salva em:', configPath);
  return config;
}

// Função para gerar código de conexão otimizado
function generateConnectionCode() {
  console.log('\n💻 GERANDO CÓDIGO DE CONEXÃO OTIMIZADO...');
  
  const connectionCode = `
// Código otimizado para conexão com balança Xiaomi
export const connectXiaomiScale = async () => {
  try {
    // 1. Verificar Bluetooth
    if (!('bluetooth' in navigator)) {
      throw new Error('Bluetooth não suportado');
    }
    
    // 2. Solicitar dispositivo com filtros expandidos
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '0000181d-0000-1000-8000-00805f9b34fb', // Weight Scale
        '0000180f-0000-1000-8000-00805f9b34fb', // Battery
        '0000181b-0000-1000-8000-00805f9b34fb', // Body Composition
        '00001530-1212-efde-1523-785feabcd123', // Mi Fitness
        'a22116c4-b1b4-4e40-8c71-c1e3e5b0b2b3', // Custom Mi Scale
        '0000180a-0000-1000-8000-00805f9b34fb', // Device Info
        '0000180d-0000-1000-8000-00805f9b34fb', // Heart Rate
        '0000180e-0000-1000-8000-00805f9b34fb', // Health Thermometer
      ]
    });
    
    console.log('Dispositivo encontrado:', device.name);
    
    // 3. Conectar ao servidor GATT
    const server = await device.gatt.connect();
    console.log('Conectado ao servidor GATT');
    
    // 4. Descobrir todos os serviços
    const services = await server.getPrimaryServices();
    console.log('Serviços encontrados:', services.length);
    
    // 5. Configurar notificações para todos os serviços
    for (const service of services) {
      try {
        const characteristics = await service.getCharacteristics();
        for (const characteristic of characteristics) {
          if (characteristic.properties.notify || characteristic.properties.indicate) {
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', handleData);
            console.log('Notificação configurada para:', characteristic.uuid);
          }
        }
      } catch (err) {
        console.log('Erro ao configurar serviço:', service.uuid, err);
      }
    }
    
    return { device, server, services };
    
  } catch (error) {
    console.error('Erro na conexão:', error);
    throw error;
  }
};

// Handler para dados recebidos
const handleData = (event) => {
  const value = event.target.value;
  console.log('Dados recebidos:', Array.from(new Uint8Array(value.buffer)));
  
  // Processar dados da balança Xiaomi
  if (value.byteLength >= 4) {
    const weight = value.getUint16(1, true) / 200.0;
    console.log('Peso detectado:', weight, 'kg');
  }
};
`;

  // Salvar código
  const codePath = path.join(__dirname, '../src/utils/xiaomi-scale-connection.js');
  fs.writeFileSync(codePath, connectionCode);
  
  console.log('✅ Código de conexão salvo em:', codePath);
  return connectionCode;
}

// Função para gerar instruções de solução de problemas
function generateTroubleshootingGuide() {
  console.log('\n🔧 GERANDO GUIA DE SOLUÇÃO DE PROBLEMAS...');
  
  const guide = `
# 🔧 Guia de Solução de Problemas - Balança Xiaomi

## Problemas Comuns e Soluções

### 1. Balança não é detectada
**Sintomas:** Nenhum dispositivo aparece na lista
**Soluções:**
- Verifique se a balança está ligada
- Certifique-se de que está próxima ao computador
- Tente resetar a balança (remova as pilhas por 30 segundos)
- Use Chrome ou Edge (não Safari)

### 2. Conexão falha
**Sintomas:** Erro "Falha na conexão GATT"
**Soluções:**
- Verifique se o Bluetooth está ativado
- Tente desconectar e reconectar
- Reinicie o navegador
- Verifique se não há outros dispositivos conectados

### 3. Dados não são recebidos
**Sintomas:** Conecta mas não recebe dados
**Soluções:**
- Suba na balança descalço
- Aguarde a estabilização (5-10 segundos)
- Verifique se a balança está calibrada
- Tente uma nova pesagem

### 4. Dados incorretos
**Sintomas:** Peso ou composição corporal incorretos
**Soluções:**
- Verifique se os dados pessoais estão corretos (altura, idade, sexo)
- Calibre a balança em superfície plana
- Use sempre a mesma posição (pés descalços no centro)

## Configurações Recomendadas

### Navegador
- Chrome 88+ ou Edge 88+
- HTTPS obrigatório
- Permissões Bluetooth habilitadas

### Sistema
- Bluetooth 4.0+ (BLE)
- Windows 10+ ou macOS 10.15+
- Distância máxima: 2 metros

### Balança
- Xiaomi Mi Body Composition Scale 2
- Firmware atualizado
- Baterias com carga >20%
`;

  // Salvar guia
  const guidePath = path.join(__dirname, '../XIAOMI_TROUBLESHOOTING.md');
  fs.writeFileSync(guidePath, guide);
  
  console.log('✅ Guia de solução de problemas salvo em:', guidePath);
  return guide;
}

// Função principal
async function main() {
  console.log('🚀 Iniciando diagnóstico da balança Xiaomi...\n');
  
  try {
    // 1. Verificar sistema
    const systemOk = await checkSystem();
    if (!systemOk) {
      console.log('❌ Sistema não está pronto. Verifique as dependências.');
      return;
    }
    
    // 2. Gerar configuração otimizada
    const config = generateOptimizedConfig();
    
    // 3. Gerar código de conexão
    const connectionCode = generateConnectionCode();
    
    // 4. Gerar guia de solução de problemas
    const troubleshootingGuide = generateTroubleshootingGuide();
    
    console.log('\n🎉 DIAGNÓSTICO CONCLUÍDO!');
    console.log('=====================================');
    console.log('✅ Configuração otimizada gerada');
    console.log('✅ Código de conexão atualizado');
    console.log('✅ Guia de solução de problemas criado');
    console.log('\n📋 Próximos passos:');
    console.log('1. Reinicie o navegador');
    console.log('2. Acesse a página de pesagem');
    console.log('3. Use o botão "Diagnosticar Balança Xiaomi"');
    console.log('4. Execute o "Ajuste Automático" se necessário');
    console.log('\n🔗 URLs úteis:');
    console.log('- Página de pesagem: http://localhost:8080/dashboard');
    console.log('- Configuração: src/config/xiaomi-scale-config.json');
    console.log('- Código: src/utils/xiaomi-scale-connection.js');
    console.log('- Guia: XIAOMI_TROUBLESHOOTING.md');
    
  } catch (error) {
    console.error('❌ Erro durante o diagnóstico:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  checkSystem,
  generateOptimizedConfig,
  generateConnectionCode,
  generateTroubleshootingGuide,
  XIAOMI_CONFIG
}; 