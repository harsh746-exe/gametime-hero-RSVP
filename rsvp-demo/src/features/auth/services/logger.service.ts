export interface Logger {
  info(message: string, data?: any): void;
  error(message: string, error?: any): void;
  debug(message: string, data?: any): void;
}

export class ConsoleLogger implements Logger {
  info(message: string, data?: any): void {
    console.log(`[INFO] ${message}`, data || '');
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
  }

  debug(message: string, data?: any): void {
    console.debug(`[DEBUG] ${message}`, data || '');
  }
} 