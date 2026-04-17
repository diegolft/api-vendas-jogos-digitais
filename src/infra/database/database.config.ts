import type { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';
import type { EnvironmentVariables } from '../../shared/config/env.validation';

/** TLS para PostgreSQL remoto (ex.: pg_hba exige criptografia). */
export function getPgSslFromEnv(
  env: Record<string, string | undefined>,
): false | { rejectUnauthorized: boolean } {
  const explicit = env.DATABASE_SSL?.trim().toLowerCase();
  if (explicit === 'false' || explicit === '0') {
    return false;
  }

  const databaseUrl = env.DATABASE_URL?.trim();
  if (databaseUrl) {
    try {
      const normalized = databaseUrl.replace(/^postgresql:/i, 'postgres:');
      const url = new URL(normalized);
      const mode = url.searchParams.get('sslmode')?.toLowerCase();
      if (mode === 'disable') {
        return false;
      }
      if (
        mode === 'require' ||
        mode === 'verify-ca' ||
        mode === 'verify-full' ||
        mode === 'allow' ||
        mode === 'prefer'
      ) {
        return pgSslOptions(env);
      }
    } catch {
      // URL inválida: ignora sslmode na URL
    }
  }

  if (explicit === 'true' || explicit === '1') {
    return pgSslOptions(env);
  }

  return false;
}

function pgSslOptions(env: Record<string, string | undefined>): { rejectUnauthorized: boolean } {
  const rejectUnauthorized = env.DATABASE_SSL_REJECT_UNAUTHORIZED?.trim().toLowerCase() !== 'false';
  return { rejectUnauthorized };
}

function sslEnvFromConfigService(
  configService: ConfigService<EnvironmentVariables>,
): Record<string, string | undefined> {
  return {
    DATABASE_URL: configService.get<string>('DATABASE_URL') ?? undefined,
    DATABASE_SSL: configService.get<string>('DATABASE_SSL') ?? undefined,
    DATABASE_SSL_REJECT_UNAUTHORIZED:
      configService.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED') ?? undefined,
  };
}

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
  const ssl = getPgSslFromEnv(sslEnvFromConfigService(configService));
  const databaseUrl = configService.get<string>('DATABASE_URL');
  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
      ssl: ssl === false ? false : ssl,
    };
  }

  return {
    host: configService.get<string>('DB_HOST') ?? 'localhost',
    port: Number(configService.get<number>('DB_PORT') ?? 5432),
    database: configService.get<string>('DB_NAME') ?? 'avjd',
    user: configService.get<string>('DB_USER') ?? 'postgres',
    password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
    ssl: ssl === false ? false : ssl,
  };
}

