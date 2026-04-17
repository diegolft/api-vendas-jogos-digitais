export interface EnvironmentVariables {
  NODE_ENV: string;
  APP_PORT: number;
  JWT_SECRET: string;
  DATABASE_URL?: string;
  DB_HOST?: string;
  DB_PORT?: number;
  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
}

function ensureNumber(value: unknown, key: string, fallback?: number): number {
  if (value === undefined || value === null || value === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`A variável de ambiente ${key} é obrigatória.`);
  }

  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue)) {
    throw new Error(`A variável de ambiente ${key} deve ser numérica.`);
  }

  return parsedValue;
}

function ensureString(value: unknown, key: string, fallback?: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`A variável de ambiente ${key} é obrigatória.`);
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const environment: EnvironmentVariables = {
    NODE_ENV: ensureString(config.NODE_ENV, 'NODE_ENV', 'development'),
    APP_PORT: ensureNumber(config.APP_PORT, 'APP_PORT', 3000),
    JWT_SECRET: ensureString(config.JWT_SECRET, 'JWT_SECRET'),
  };

  if (typeof config.DATABASE_URL === 'string' && config.DATABASE_URL.trim().length > 0) {
    environment.DATABASE_URL = config.DATABASE_URL.trim();
    return environment;
  }

  environment.DB_HOST = ensureString(config.DB_HOST, 'DB_HOST');
  environment.DB_PORT = ensureNumber(config.DB_PORT, 'DB_PORT', 5432);
  environment.DB_NAME = ensureString(config.DB_NAME, 'DB_NAME');
  environment.DB_USER = ensureString(config.DB_USER, 'DB_USER');
  environment.DB_PASSWORD = ensureString(config.DB_PASSWORD, 'DB_PASSWORD');

  return environment;
}

