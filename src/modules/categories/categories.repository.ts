import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { categoriesTable } from '../../infra/database/schema';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.db
      .select()
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.nome));
  }

  async findById(id: number) {
    const [category] = await this.databaseService.db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1);

    return category ?? null;
  }
}


