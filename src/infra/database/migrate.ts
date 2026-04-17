import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseUrlFromEnv, getPgSslFromEnv } from './database.config';

async function main() {
  const ssl = getPgSslFromEnv(process.env);
  const pool = new Pool({
    connectionString: getDatabaseUrlFromEnv(process.env),
    ssl: ssl === false ? false : ssl,
  });

  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('Migracoes aplicadas com sucesso.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Erro ao aplicar migracoes.', error);
  process.exit(1);
});

