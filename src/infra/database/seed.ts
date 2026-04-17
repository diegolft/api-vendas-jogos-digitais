import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import { hashPassword } from '../../shared/utils/password.util';
import { getDatabaseUrlFromEnv, getPgSslFromEnv } from './database.config';
import { categorySeeds, companySeeds, gameSeeds } from './seeds/catalog.seed';
import {
  categoriesTable,
  companiesTable,
  gamesTable,
  profilesTable,
  usersTable,
} from './schema';

async function main() {
  const ssl = getPgSslFromEnv(process.env);
  const pool = new Pool({
    connectionString: getDatabaseUrlFromEnv(process.env),
    ssl: ssl === false ? false : ssl,
  });

  try {
    const db = drizzle(pool);

    await db
      .insert(profilesTable)
      .values([
        { nome: PROFILE_NAMES.ADMIN },
        { nome: PROFILE_NAMES.CLIENT },
      ])
      .onConflictDoNothing({ target: profilesTable.nome });

    const [adminProfile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.nome, PROFILE_NAMES.ADMIN))
      .limit(1);
    const [clientProfile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.nome, PROFILE_NAMES.CLIENT))
      .limit(1);

    if (!adminProfile || !clientProfile) {
      throw new Error('Perfis base nao encontrados apos o seed.');
    }

    const adminPassword = await hashPassword('admin123');
    const clientPassword = await hashPassword('cliente123');

    await db
      .insert(usersTable)
      .values([
        {
          nome: 'Admin',
          email: 'admin@avjd.com',
          senha: adminPassword,
          dataNascimento: null,
          fkPerfil: adminProfile.id,
        },
        {
          nome: 'Cliente',
          email: 'cliente@avjd.com',
          senha: clientPassword,
          dataNascimento: null,
          fkPerfil: clientProfile.id,
        },
      ])
      .onConflictDoNothing({ target: usersTable.email });

    await db
      .insert(categoriesTable)
      .values(categorySeeds.map((nome) => ({ nome })))
      .onConflictDoNothing({ target: categoriesTable.nome });

    await db
      .insert(companiesTable)
      .values(companySeeds.map((nome) => ({ nome })))
      .onConflictDoNothing({ target: companiesTable.nome });

    const categories = await db.select().from(categoriesTable);
    const companies = await db.select().from(companiesTable);

    const categoryMap = new Map(categories.map((category) => [category.nome, category.id]));
    const companyMap = new Map(companies.map((company) => [company.nome, company.id]));

    for (const game of gameSeeds) {
      const fkCategoria = categoryMap.get(game.categoria);
      const fkEmpresa = companyMap.get(game.empresa);

      if (!fkCategoria || !fkEmpresa) {
        continue;
      }

      await db
        .insert(gamesTable)
        .values({
          nome: game.nome,
          descricao: game.descricao,
          ano: game.ano,
          preco: game.preco,
          desconto: 0,
          fkCategoria,
          fkEmpresa,
        })
        .onConflictDoNothing({ target: [gamesTable.nome, gamesTable.fkEmpresa] });
    }

    console.log('Seed concluido com sucesso.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Erro ao executar seed.', error);
  process.exit(1);
});

