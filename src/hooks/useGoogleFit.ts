import { useState, useEffect } from 'react';
import { googleFitService } from '@/services/googleFitService';

export const useGoogleFit = (userId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se já está conectado
    const connected = googleFitService.isConnected();
    setIsConnected(connected);
    
    // Carregar data da última sincronização do localStorage
    const lastSyncStr = localStorage.getItem('google_fit_last_sync');
    if (lastSyncStr) {
      setLastSync(new Date(lastSyncStr));
    }
  }, []);

  const connect = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await googleFitService.authenticateUser();
      setIsConnected(true);
      return true;
    } catch (error) {
      console.error('Erro ao conectar:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sync = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await googleFitService.syncAllData(userId);
      const now = new Date();
      setLastSync(now);
      localStorage.setItem('google_fit_last_sync', now.toISOString());
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    googleFitService.disconnect();
    setIsConnected(false);
    setLastSync(null);
    localStorage.removeItem('google_fit_last_sync');
  };

  const getConnectionStatus = () => {
    if (!isConnected) return 'disconnected';
    if (isLoading) return 'loading';
    return 'connected';
  };

  const getConnectedEmail = () => {
    return localStorage.getItem('google_fit_email');
  };

  return {
    isConnected,
    lastSync,
    isLoading,
    connect,
    sync,
    disconnect,
    getConnectionStatus,
    getConnectedEmail
  };
};