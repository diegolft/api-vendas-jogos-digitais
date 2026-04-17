import { Injectable } from '@nestjs/common';
import { and, asc, eq, ilike, ne } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { companiesTable } from '../../infra/database/schema';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(nome?: string) {
    if (nome) {
      return this.databaseService.db
        .select()
        .from(companiesTable)
        .where(ilike(companiesTable.nome, `%${nome}%`))
        .orderBy(asc(companiesTable.nome));
    }

    return this.databaseService.db
      .select()
      .from(companiesTable)
      .orderBy(asc(companiesTable.nome));
  }

  async findById(id: number) {
    const [company] = await this.databaseService.db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, id))
      .limit(1);

    return company ?? null;
  }

  async findByName(nome: string, ignoreId?: number) {
    const [company] = await this.databaseService.db
      .select()
      .from(companiesTable)
      .where(
        ignoreId
          ? and(eq(companiesTable.nome, nome), ne(companiesTable.id, ignoreId))
          : eq(companiesTable.nome, nome),
      )
      .limit(1);

    return company ?? null;
  }

  async create(nome: string) {
    const [createdCompany] = await this.databaseService.db
      .insert(companiesTable)
      .values({ nome })
      .returning();

    return createdCompany;
  }

  async update(id: number, nome: string) {
    const [updatedCompany] = await this.databaseService.db
      .update(companiesTable)
      .set({ nome })
      .where(eq(companiesTable.id, id))
      .returning();

    return updatedCompany ?? null;
  }

  async delete(id: number) {
    const deletedCompanies = await this.databaseService.db
      .delete(companiesTable)
      .where(eq(companiesTable.id, id))
      .returning({ id: companiesTable.id });

    return deletedCompanies.length;
  }
}


