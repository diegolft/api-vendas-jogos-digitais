import type { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';
import type { EnvironmentVariables } from '../../shared/config/env.validation';

const SSL_QUERY_KEYS = ['sslmode', 'ssl', 'sslcert', 'sslkey', 'sslrootcert'] as const;

/**
 * Remove parâmetros SSL da URL. O `pg` pode aplicar verificação de certificado a partir
 * da query string e ignorar `ssl.rejectUnauthorized` do objeto de config — causa típica de
 * SELF_SIGNED_CERT_IN_CHAIN mesmo com rejectUnauthorized: false no código.
 */
export function stripSslSearchParamsFromConnectionString(connectionString: string): string {
  try {
    const normalized = connectionString.replace(/^postgresql:/i, 'postgres:');
    const url = new URL(normalized);
    for (const key of SSL_QUERY_KEYS) {
      url.searchParams.delete(key);
    }
    return url.toString().replace(/^postgres:/i, 'postgresql:');
  } catch {
    return connectionString;
  }
}

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

  const host = getPostgresHostFromEnv(env);
  if (host && looksLikeRemoteHostRequiringTls(host)) {
    return pgSslOptions(env);
  }

  return false;
}

function getPostgresHostFromEnv(env: Record<string, string | undefined>): string | undefined {
  const direct = env.DB_HOST?.trim();
  if (direct) {
    return direct;
  }
  const raw = env.DATABASE_URL?.trim();
  if (!raw) {
    return undefined;
  }
  try {
    const normalized = raw.replace(/^postgresql:/i, 'postgres:');
    return new URL(normalized).hostname || undefined;
  } catch {
    return undefined;
  }
}

/** Host que claramente não é só máquina local / serviço Docker sem FQDN — remoto costuma exigir TLS. */
function looksLikeRemoteHostRequiringTls(hostname: string): boolean {
  const h = hostname.trim().toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1') {
    return false;
  }
  // Nomes curtos típicos de serviço em Docker Compose / rede interna sem TLS
  if (!h.includes('.') && !h.includes(':')) {
    return false;
  }
  return true;
}

function pgSslOptions(env: Record<string, string | undefined>): { rejectUnauthorized: boolean } {
  const raw = env.DATABASE_SSL_REJECT_UNAUTHORIZED?.trim().toLowerCase();
  // Padrão permissivo: PaaS e Postgres geridos costumam usar cadeia/CA que o Node não valida.
  if (raw === 'true' || raw === '1') {
    return { rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

function envRecordFromConfigService(
  configService: ConfigService<EnvironmentVariables>,
): Record<string, string | undefined> {
  const dbPort = configService.get<number>('DB_PORT');
  return {
    DATABASE_URL: configService.get<string>('DATABASE_URL') ?? undefined,
    DATABASE_SSL: configService.get<string>('DATABASE_SSL') ?? undefined,
    DATABASE_SSL_REJECT_UNAUTHORIZED:
      configService.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED') ?? undefined,
    DB_HOST: configService.get<string>('DB_HOST') ?? undefined,
    DB_PORT: dbPort !== undefined && dbPort !== null ? String(dbPort) : undefined,
    DB_NAME: configService.get<string>('DB_NAME') ?? undefined,
    DB_USER: configService.get<string>('DB_USER') ?? undefined,
    DB_PASSWORD: configService.get<string>('DB_PASSWORD') ?? undefined,
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

/** Pool `pg` a partir de variáveis de ambiente (API, migrate, seed). */
export function buildPgPoolConfigFromEnv(env: Record<string, string | undefined>): PoolConfig {
  const ssl = getPgSslFromEnv(env);
  const databaseUrl = env.DATABASE_URL?.trim();

  if (databaseUrl) {
    const useTls = ssl !== false;
    return {
      connectionString: useTls ? stripSslSearchParamsFromConnectionString(databaseUrl) : databaseUrl,
      ssl: useTls ? ssl : false,
    };
  }

  return {
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? '5432'),
    database: env.DB_NAME ?? 'avjd',
    user: env.DB_USER ?? 'postgres',
    password: env.DB_PASSWORD ?? 'postgres',
    ssl: ssl === false ? false : ssl,
  };
}

export function getDatabasePoolConfig(
  configService: ConfigService<EnvironmentVariables>,
): PoolConfig {
  return buildPgPoolConfigFromEnv(envRecordFromConfigService(configService));
}

