import type { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';
import type { EnvironmentVariables } from '../../shared/config/env.validation';

export function getDatabaseUrlFromEnv(env: Record<string, string | undefined>): string {
  if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
    return env.DATABASE_URL.trim();
  }

  const host = env.DB_HOST ?? 'localhost';
  const port = env.DB_PORT ?? '5432';
  const database = env.DB_NAME ?? 'avjd';
  const user = env.DB_USER ?? 'postgres';
  const password = env.DB_PASSWORD ?? 'postgres';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

export function getDatabasePoolConfig(
  configService: ConfigService<EnvironmentVariables>,
): PoolConfig {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
      ssl: false,
    };
  }

  return {
    host: configService.get<string>('DB_HOST') ?? 'localhost',
    port: Number(configService.get<number>('DB_PORT') ?? 5432),
    database: configService.get<string>('DB_NAME') ?? 'avjd',
    user: configService.get<string>('DB_USER') ?? 'postgres',
    password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
    ssl: false,
  };
}

