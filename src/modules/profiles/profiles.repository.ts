import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { profilesTable } from '../../infra/database/schema';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.db
      .select()
      .from(profilesTable)
      .orderBy(asc(profilesTable.id));
  }

  async findById(id: number) {
    const [profile] = await this.databaseService.db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.id, id))
      .limit(1);

    return profile ?? null;
  }

  async findByName(nome: string) {
    const [profile] = await this.databaseService.db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.nome, nome))
      .limit(1);

    return profile ?? null;
  }

  /** Garante Administrador e Cliente (equivalente ao início do seed). Idempotente. */
  async ensureBaseProfiles(): Promise<void> {
    await this.databaseService.db
      .insert(profilesTable)
      .values([{ nome: PROFILE_NAMES.ADMIN }, { nome: PROFILE_NAMES.CLIENT }])
      .onConflictDoNothing({ target: profilesTable.nome });
  }

  async create(nome: string) {
    const [createdProfile] = await this.databaseService.db
      .insert(profilesTable)
      .values({ nome })
      .returning();

    return createdProfile;
  }
}


