import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    gapi: any;
  }
}

class GoogleFitService {
  private clientId: string;
  private scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.location.read'
  ];

  constructor() {
    // Usar variável de ambiente - obrigatória
    this.clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    
    if (!this.clientId) {
      throw new Error('VITE_GOOGLE_CLIENT_ID is required for Google Fit integration');
    }
  }

  // Inicializar Google API
  async initializeGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar se já está carregado
      if (window.gapi && window.gapi.auth2) {
        console.log('✅ Google API já carregada');
        resolve();
        return;
      }

      // Verificar se o script já foi adicionado
      const existingScript = document.querySelector('script[src*="apis.google.com/js/api.js"]');
      if (existingScript) {
        console.log('✅ Script Google API já carregado, aguardando inicialização...');
        // Aguardar um pouco para garantir que a API foi inicializada
        setTimeout(() => {
          if (window.gapi && window.gapi.auth2) {
            resolve();
          } else {
            reject(new Error('Google API não inicializada após carregamento do script'));
          }
        }, 1000);
        return;
      }

      console.log('🔄 Carregando Google API...');
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Script Google API carregado, inicializando...');
        window.gapi.load('auth2', () => {
          console.log('✅ Google Auth2 carregado, inicializando...');
          window.gapi.auth2.init({
            client_id: this.clientId,
            scope: this.scopes.join(' ')
          }).then(() => {
            console.log('✅ Google Auth2 inicializado com sucesso');
            resolve();
          }).catch((error: any) => {
            console.error('❌ Erro ao inicializar Google Auth2:', error);
            reject(new Error('Falha ao inicializar Google Auth2: ' + error.message));
          });
        });
      };
      
      script.onerror = () => {
        console.error('❌ Erro ao carregar script Google API');
        reject(new Error('Falha ao carregar Google API'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Autenticar usuário (OAuth 2.0)
  async authenticateUser(): Promise<string> {
    try {
      console.log('🔐 Iniciando autenticação Google Fit...');
      await this.initializeGoogleAPI();
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        throw new Error('Google Auth não inicializado');
      }

      console.log('🔑 Solicitando autorização...');
      const user = await authInstance.signIn({
        scope: this.scopes.join(' ')
      });
      
      console.log('✅ Usuário autenticado:', user.getBasicProfile().getEmail());
      
      const authResponse = user.getAuthResponse();
      if (!authResponse || !authResponse.access_token) {
        throw new Error('Token de acesso não obtido');
      }

      const accessToken = authResponse.access_token;
      const email = user.getBasicProfile().getEmail();
      
      if (!email) {
        throw new Error('Email do usuário não disponível');
      }
      
      console.log('💾 Salvando credenciais...');
      
      // Salvar token no localStorage
      localStorage.setItem('google_fit_token', accessToken);
      localStorage.setItem('google_fit_email', email);
      
      // Salvar credenciais no Supabase
      try {
      const { error } = await supabase
        .from('user_google_credentials')
        .upsert({
          email: email,
          access_token: accessToken,
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hora
        });

      if (error) {
          console.error('⚠️ Erro ao salvar credenciais no Supabase:', error);
          // Não falhar se não conseguir salvar no Supabase
        } else {
          console.log('✅ Credenciais salvas no Supabase');
        }
      } catch (supabaseError) {
        console.error('⚠️ Erro ao salvar no Supabase:', supabaseError);
        // Não falhar se não conseguir salvar no Supabase
      }
      
      console.log('🎉 Autenticação Google Fit concluída com sucesso!');
      return accessToken;
    } catch (error: any) {
      console.error('❌ Erro na autenticação:', error);
      
      // Tratamento específico de erros
      if (error.message?.includes('popup_closed')) {
        throw new Error('Autenticação cancelada pelo usuário');
      }
      
      if (error.message?.includes('access_denied')) {
        throw new Error('Acesso negado pelo usuário');
      }
      
      if (error.message?.includes('immediate_failed')) {
        throw new Error('Usuário não está logado no Google');
      }
      
      if (error.message?.includes('idpiframe_initialization_failed')) {
        throw new Error('Erro de inicialização do Google. Verifique sua conexão com a internet');
      }
      
      // Erro genérico
      const errorMessage = error.message || 'Erro desconhecido';
      throw new Error('Falha na autenticação com Google: ' + errorMessage);
    }
  }

  // Buscar dados de passos
  async getStepsData(startDate: string, endDate: string): Promise<any> {
    const token = localStorage.getItem('google_fit_token');
    if (!token) throw new Error('Token não encontrado');

    try {
    const response = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 }, // 1 dia
          startTimeMillis: new Date(startDate).getTime(),
          endTimeMillis: new Date(endDate).getTime()
        })
      }
    );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
      }

    return response.json();
    } catch (error) {
      console.error('Erro ao buscar dados de passos:', error);
      throw error;
    }
  }

  // Buscar dados de peso
  async getWeightData(startDate: string, endDate: string): Promise<any> {
    const token = localStorage.getItem('google_fit_token');
    if (!token) throw new Error('Token não encontrado');

    try {
    const response = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.weight:com.google.android.gms:merge_weight/datasets/${new Date(startDate).getTime()}000000-${new Date(endDate).getTime()}000000`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
      }

    return response.json();
    } catch (error) {
      console.error('Erro ao buscar dados de peso:', error);
      throw error;
    }
  }

  // Buscar frequência cardíaca
  async getHeartRateData(startDate: string, endDate: string): Promise<any> {
    const token = localStorage.getItem('google_fit_token');
    if (!token) throw new Error('Token não encontrado');

    try {
    const response = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.heart_rate.bpm'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: new Date(startDate).getTime(),
          endTimeMillis: new Date(endDate).getTime()
        })
      }
    );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
      }

    return response.json();
    } catch (error) {
      console.error('Erro ao buscar dados de frequência cardíaca:', error);
      throw error;
    }
  }

  // Sincronizar todos os dados
  async syncAllData(userId: string, days: number = 7): Promise<void> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      console.log('🔄 Iniciando sincronização Google Fit...');
      console.log(`📅 Período: ${startDate.toISOString()} até ${endDate.toISOString()}`);

      const [stepsData, weightData, heartRateData] = await Promise.allSettled([
        this.getStepsData(startDate.toISOString(), endDate.toISOString()),
        this.getWeightData(startDate.toISOString(), endDate.toISOString()),
        this.getHeartRateData(startDate.toISOString(), endDate.toISOString())
      ]);

      // Processar resultados
      const results = {
        steps: stepsData.status === 'fulfilled' ? stepsData.value : null,
        weight: weightData.status === 'fulfilled' ? weightData.value : null,
        heartRate: heartRateData.status === 'fulfilled' ? heartRateData.value : null
      };

      // Log dos resultados
      console.log('📊 Resultados da sincronização:');
      console.log('- Passos:', results.steps ? '✅' : '❌');
      console.log('- Peso:', results.weight ? '✅' : '❌');
      console.log('- Frequência cardíaca:', results.heartRate ? '✅' : '❌');

      // Processar e salvar no Supabase
      await this.saveToSupabase(userId, results);

    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      throw error;
    }
  }

  // Salvar dados no Supabase
  private async saveToSupabase(userId: string, data: any): Promise<void> {
    const processedData: any[] = [];
    
    // Processar dados de passos
    if (data.steps?.bucket) {
      for (const bucket of data.steps.bucket) {
        if (bucket.dataset?.[0]?.point) {
          for (const point of bucket.dataset[0].point) {
            processedData.push({
              user_id: userId,
              data_type: 'steps',
              value: point.value[0].intVal,
              unit: 'steps',
              timestamp: new Date(parseInt(point.endTimeNanos) / 1000000),
              source: 'google_fit_api'
            });
          }
        }
      }
    }

    // Processar dados de peso
    if (data.weight?.point) {
      for (const point of data.weight.point) {
        processedData.push({
          user_id: userId,
          data_type: 'weight',
          value: point.value[0].fpVal,
          unit: 'kg',
          timestamp: new Date(parseInt(point.endTimeNanos) / 1000000),
          source: 'google_fit_api'
        });
      }
    }

    // Processar frequência cardíaca
    if (data.heartRate?.bucket) {
      for (const bucket of data.heartRate.bucket) {
        if (bucket.dataset?.[0]?.point) {
          for (const point of bucket.dataset[0].point) {
            processedData.push({
              user_id: userId,
              data_type: 'heart_rate',
              value: point.value[0].fpVal,
              unit: 'bpm',
              timestamp: new Date(parseInt(point.endTimeNanos) / 1000000),
              source: 'google_fit_api'
            });
          }
        }
      }
    }

    // Salvar todos os dados
    if (processedData.length > 0) {
      console.log(`💾 Salvando ${processedData.length} registros no Supabase...`);
      
      const { error } = await supabase
        .from('google_fit_data')
        .insert(processedData);

      if (error) {
        console.error('❌ Erro ao salvar dados:', error);
        throw error;
      }
      
      console.log('✅ Dados salvos com sucesso!');
    } else {
      console.log('ℹ️ Nenhum dado para salvar');
    }
  }

  // Verificar se está conectado
  isConnected(): boolean {
    const token = localStorage.getItem('google_fit_token');
    const email = localStorage.getItem('google_fit_email');
    return !!(token && email);
  }

  // Desconectar
  disconnect(): void {
    localStorage.removeItem('google_fit_token');
    localStorage.removeItem('google_fit_email');
    console.log('🔌 Google Fit desconectado');
  }

  // Verificar se o token ainda é válido
  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem('google_fit_token');
    if (!token) return false;

    try {
      const response = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataSources',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.ok;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }
}

export const googleFitService = new GoogleFitService();