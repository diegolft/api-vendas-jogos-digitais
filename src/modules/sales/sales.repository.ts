import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { salesTable } from '../../infra/database/schema';

interface CreateSalePayload {
  fkUsuario: number;
  valorTotal: number;
  quantidade: number;
  data: Date;
}

@Injectable()
export class SalesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private getExecutor(executor?: any) {
    return executor ?? this.databaseService.db;
  }

  async findByUser(userId: number) {
    return this.databaseService.db
      .select()
      .from(salesTable)
      .where(eq(salesTable.fkUsuario, userId))
      .orderBy(desc(salesTable.data));
  }

  async create(payload: CreateSalePayload, executor?: any) {
    const db = this.getExecutor(executor);
    const [createdSale] = await db.insert(salesTable).values(payload).returning();
    return createdSale;
  }
}


