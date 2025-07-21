// Sistema de logging centralizado
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
  userId?: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  constructor() {
    this.logLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'warn';
    this.isDevelopment = import.meta.env.VITE_DEBUG_MODE === 'true';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.logLevel];
  }

  private createLogEntry(
    level: LogLevel, 
    message: string, 
    data?: any, 
    component?: string
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component,
      userId: this.getCurrentUserId()
    };
  }

  private getCurrentUserId(): string | undefined {
    // Try to get user ID from localStorage or session
    try {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.id;
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  private addToMemory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const component = entry.component ? `[${entry.component}]` : '';
    return `${timestamp} ${component} ${entry.message}`;
  }

  debug(message: string, data?: any, component?: string): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, data, component);
    this.addToMemory(entry);
    
    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry), data);
    }
  }

  info(message: string, data?: any, component?: string): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, data, component);
    this.addToMemory(entry);
    
    if (this.isDevelopment) {
      console.info(this.formatMessage(entry), data);
    }
  }

  warn(message: string, data?: any, component?: string): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, data, component);
    this.addToMemory(entry);
    
    console.warn(this.formatMessage(entry), data);
  }

  error(message: string, error?: any, component?: string): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, error, component);
    this.addToMemory(entry);
    
    console.error(this.formatMessage(entry), error);
    
    // In production, you might want to send errors to a monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    // Placeholder for production error monitoring
    // You can integrate with Sentry, LogRocket, or similar services
    try {
      if (entry.level === 'error') {
        // Example: Send to monitoring service
        // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
      }
    } catch {
      // Fail silently to avoid logging loops
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear logs from memory
  clearLogs(): void {
    this.logs = [];
  }

  // Performance logging
  time(label: string, component?: string): void {
    if (this.isDevelopment) {
      console.time(`${component ? `[${component}] ` : ''}${label}`);
    }
  }

  timeEnd(label: string, component?: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`${component ? `[${component}] ` : ''}${label}`);
    }
  }

  // Group logging for related operations
  group(label: string, component?: string): void {
    if (this.isDevelopment) {
      console.group(`${component ? `[${component}] ` : ''}${label}`);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions for common patterns
export const logError = (error: any, context?: string) => {
  logger.error(`Error in ${context || 'unknown context'}`, error, context);
};

export const logAsyncError = async <T>(
  promise: Promise<T>, 
  context: string
): Promise<T | null> => {
  try {
    return await promise;
  } catch (error) {
    logError(error, context);
    return null;
  }
};

export const logPerformance = <T>(
  fn: () => T,
  label: string,
  component?: string
): T => {
  logger.time(label, component);
  try {
    const result = fn();
    return result;
  } finally {
    logger.timeEnd(label, component);
  }
};

export const logAsyncPerformance = async <T>(
  fn: () => Promise<T>,
  label: string,
  component?: string
): Promise<T> => {
  logger.time(label, component);
  try {
    const result = await fn();
    return result;
  } finally {
    logger.timeEnd(label, component);
  }
}; 