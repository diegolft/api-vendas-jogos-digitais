import { Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { gamesTable, wishlistTable } from '../../infra/database/schema';

@Injectable()
export class WishlistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async add(userId: number, gameId: number) {
    const [createdEntry] = await this.databaseService.db
      .insert(wishlistTable)
      .values({
        fkUsuario: userId,
        fkJogo: gameId,
      })
      .returning();

    return createdEntry;
  }

  async getByUser(userId: number) {
    return this.databaseService.db
      .select({
        id: gamesTable.id,
        nome: gamesTable.nome,
        ano: gamesTable.ano,
        preco: gamesTable.preco,
        desconto: gamesTable.desconto,
        descricao: gamesTable.descricao,
        fkEmpresa: gamesTable.fkEmpresa,
        fkCategoria: gamesTable.fkCategoria,
      })
      .from(wishlistTable)
      .innerJoin(gamesTable, eq(wishlistTable.fkJogo, gamesTable.id))
      .where(eq(wishlistTable.fkUsuario, userId))
      .orderBy(asc(gamesTable.nome));
  }

  async findByGameAndUser(userId: number, gameId: number) {
    const [entry] = await this.databaseService.db
      .select()
      .from(wishlistTable)
      .where(and(eq(wishlistTable.fkUsuario, userId), eq(wishlistTable.fkJogo, gameId)))
      .limit(1);

    return entry ?? null;
  }

  async exists(userId: number, gameId: number) {
    const [entry] = await this.databaseService.db
      .select({ id: wishlistTable.id })
      .from(wishlistTable)
      .where(and(eq(wishlistTable.fkUsuario, userId), eq(wishlistTable.fkJogo, gameId)))
      .limit(1);

    return Boolean(entry);
  }

  async remove(id: number) {
    const deletedEntries = await this.databaseService.db
      .delete(wishlistTable)
      .where(eq(wishlistTable.id, id))
      .returning({ id: wishlistTable.id });

    return deletedEntries.length;
  }
}


