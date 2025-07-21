/**
 * Utilitário para gerenciar modelos de silhueta
 * 
 * Este arquivo documenta todos os modelos de silhueta necessários
 * e fornece utilidades para trabalhar com eles.
 */

// Tipos de dados
export type Genero = 'masculino' | 'feminino';
export type FaixaIMC = 'magro' | 'normal' | 'sobrepeso' | 'obeso';

// Configuração de modelos
export const MODEL_CONFIG = {
  basePath: '/models/',
  defaultModel: 'silhueta.glb',
  format: '.glb'
} as const;

// Lista completa de modelos necessários
export const REQUIRED_MODELS = {
  // Modelo padrão (obrigatório)
  default: 'silhueta.glb',
  
  // Modelos por gênero apenas
  genero: {
    masculino: 'silhueta-masculino.glb',
    feminino: 'silhueta-feminino.glb'
  },
  
  // Modelos específicos por gênero e faixa de IMC
  especificos: {
    masculino: {
      magro: 'silhueta-masculino-magro.glb',
      normal: 'silhueta-masculino-normal.glb',
      sobrepeso: 'silhueta-masculino-sobrepeso.glb',
      obeso: 'silhueta-masculino-obeso.glb'
    },
    feminino: {
      magro: 'silhueta-feminino-magro.glb',
      normal: 'silhueta-feminino-normal.glb',
      sobrepeso: 'silhueta-feminino-sobrepeso.glb',
      obeso: 'silhueta-feminino-obeso.glb'
    }
  }
} as const;

// Função para gerar lista de todos os modelos
export const getAllRequiredModels = (): string[] => {
  const models = [];
  
  // Modelo padrão
  models.push(REQUIRED_MODELS.default);
  
  // Modelos por gênero
  Object.values(REQUIRED_MODELS.genero).forEach(model => {
    models.push(model);
  });
  
  // Modelos específicos
  Object.values(REQUIRED_MODELS.especificos).forEach(generoModels => {
    Object.values(generoModels).forEach(model => {
      models.push(model);
    });
  });
  
  return models;
};

// Função para obter caminho do modelo
export const getModelPath = (
  genero?: Genero,
  faixaIMC?: FaixaIMC
): string => {
  const basePath = MODEL_CONFIG.basePath;
  
  // Se não tiver dados, usar modelo padrão
  if (!genero || !faixaIMC) {
    return `${basePath}${REQUIRED_MODELS.default}`;
  }
  
  // Tentar modelo específico primeiro
  const modeloEspecifico = REQUIRED_MODELS.especificos[genero]?.[faixaIMC];
  if (modeloEspecifico) {
    return `${basePath}${modeloEspecifico}`;
  }
  
  // Fallback para modelo por gênero
  const modeloGenero = REQUIRED_MODELS.genero[genero];
  if (modeloGenero) {
    return `${basePath}${modeloGenero}`;
  }
  
  // Fallback final
  return `${basePath}${REQUIRED_MODELS.default}`;
};

// Função para obter lista de fallbacks em ordem de prioridade
export const getModelFallbacks = (
  genero?: Genero,
  faixaIMC?: FaixaIMC
): string[] => {
  const fallbacks = [];
  const basePath = MODEL_CONFIG.basePath;
  
  if (genero && faixaIMC) {
    // 1. Modelo específico
    const modeloEspecifico = REQUIRED_MODELS.especificos[genero]?.[faixaIMC];
    if (modeloEspecifico) {
      fallbacks.push(`${basePath}${modeloEspecifico}`);
    }
    
    // 2. Modelo normal do mesmo gênero
    const modeloNormal = REQUIRED_MODELS.especificos[genero]?.normal;
    if (modeloNormal && modeloNormal !== modeloEspecifico) {
      fallbacks.push(`${basePath}${modeloNormal}`);
    }
    
    // 3. Modelo genérico do gênero
    const modeloGenero = REQUIRED_MODELS.genero[genero];
    if (modeloGenero) {
      fallbacks.push(`${basePath}${modeloGenero}`);
    }
  } else if (genero) {
    // Se só tiver gênero, usar modelo normal do gênero
    const modeloNormal = REQUIRED_MODELS.especificos[genero]?.normal;
    if (modeloNormal) {
      fallbacks.push(`${basePath}${modeloNormal}`);
    }
    
    const modeloGenero = REQUIRED_MODELS.genero[genero];
    if (modeloGenero) {
      fallbacks.push(`${basePath}${modeloGenero}`);
    }
  }
  
  // 4. Modelo padrão (sempre por último)
  fallbacks.push(`${basePath}${REQUIRED_MODELS.default}`);
  
  return fallbacks;
};

// Função para determinar faixa de IMC
export const getFaixaIMC = (imc: number): FaixaIMC => {
  if (imc < 18.5) return 'magro';
  if (imc < 25) return 'normal';
  if (imc < 30) return 'sobrepeso';
  return 'obeso';
};

// Função para validar se um gênero é válido
export const isValidGenero = (genero: string): genero is Genero => {
  return genero === 'masculino' || genero === 'feminino';
};

// Função para validar se uma faixa de IMC é válida
export const isValidFaixaIMC = (faixa: string): faixa is FaixaIMC => {
  return ['magro', 'normal', 'sobrepeso', 'obeso'].includes(faixa);
};

// Mapeamento para facilitar debug
export const MODEL_INFO = {
  total: getAllRequiredModels().length,
  list: getAllRequiredModels(),
  byType: {
    default: 1,
    genero: Object.keys(REQUIRED_MODELS.genero).length,
    especificos: Object.values(REQUIRED_MODELS.especificos)
      .reduce((total, genero) => total + Object.keys(genero).length, 0)
  }
};

// Console log para debug (remover em produção)
if (process.env.NODE_ENV === 'development') {
  console.log('📊 Modelos de Silhueta Necessários:', {
    total: MODEL_INFO.total,
    breakdown: MODEL_INFO.byType,
    list: MODEL_INFO.list
  });
}

export default {
  getAllRequiredModels,
  getModelPath,
  getModelFallbacks,
  getFaixaIMC,
  isValidGenero,
  isValidFaixaIMC,
  MODEL_CONFIG,
  REQUIRED_MODELS,
  MODEL_INFO
};