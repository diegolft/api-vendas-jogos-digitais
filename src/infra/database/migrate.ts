import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseUrlFromEnv } from './database.config';

async function main() {
  const pool = new Pool({
    connectionString: getDatabaseUrlFromEnv(process.env),
    ssl: false,
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

