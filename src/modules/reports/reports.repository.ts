import { Injectable } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { cartItemsTable, cartsTable, companiesTable, gamesTable } from '../../infra/database/schema';

@Injectable()
export class ReportsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async countMostSold(top: number, companyId?: number) {
    return this.databaseService.db
      .select({
        nome: gamesTable.nome,
        empresa: companiesTable.nome,
        total: sql<number>`count(${cartItemsTable.fkJogo})`,
      })
      .from(gamesTable)
      .leftJoin(cartItemsTable, eq(gamesTable.id, cartItemsTable.fkJogo))
      .leftJoin(cartsTable, eq(cartItemsTable.fkCarrinho, cartsTable.id))
      .leftJoin(companiesTable, eq(gamesTable.fkEmpresa, companiesTable.id))
      .where(
        companyId
          ? and(eq(cartsTable.status, 'F'), eq(companiesTable.id, companyId))
          : eq(cartsTable.status, 'F'),
      )
      .groupBy(gamesTable.id, gamesTable.nome, companiesTable.nome)
      .orderBy(desc(sql`count(${cartItemsTable.fkJogo})`))
      .limit(top);
  }
}


