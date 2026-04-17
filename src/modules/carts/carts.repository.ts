import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { cartItemsTable, cartsTable } from '../../infra/database/schema';

@Injectable()
export class CartsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private getExecutor(executor?: any) {
    return executor ?? this.databaseService.db;
  }

  async findByUser(userId: number) {
    return this.databaseService.db
      .select()
      .from(cartsTable)
      .where(eq(cartsTable.fkUsuario, userId))
      .orderBy(desc(cartsTable.id));
  }

  async findActiveByUser(userId: number) {
    const [cart] = await this.databaseService.db
      .select()
      .from(cartsTable)
      .where(and(eq(cartsTable.fkUsuario, userId), eq(cartsTable.status, 'A')))
      .limit(1);

    return cart ?? null;
  }

  async findActiveByUserAndGame(userId: number, gameId: number) {
    const [cartItem] = await this.databaseService.db
      .select({
        id: cartItemsTable.id,
        fkJogo: cartItemsTable.fkJogo,
        fkCarrinho: cartItemsTable.fkCarrinho,
        chaveAtivacao: cartItemsTable.chaveAtivacao,
      })
      .from(cartsTable)
      .innerJoin(cartItemsTable, eq(cartsTable.id, cartItemsTable.fkCarrinho))
      .where(
        and(
          eq(cartsTable.fkUsuario, userId),
          eq(cartsTable.status, 'A'),
          eq(cartItemsTable.fkJogo, gameId),
        ),
      )
      .limit(1);

    return cartItem ?? null;
  }

  async findItemsByCartId(cartId: number) {
    return this.databaseService.db
      .select({
        id: cartItemsTable.id,
        fkJogo: cartItemsTable.fkJogo,
        fkCarrinho: cartItemsTable.fkCarrinho,
        chaveAtivacao: cartItemsTable.chaveAtivacao,
      })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.fkCarrinho, cartId))
      .orderBy(asc(cartItemsTable.id));
  }

  async findItemByCartAndGame(cartId: number, gameId: number) {
    const [cartItem] = await this.databaseService.db
      .select({
        id: cartItemsTable.id,
        fkJogo: cartItemsTable.fkJogo,
        fkCarrinho: cartItemsTable.fkCarrinho,
        chaveAtivacao: cartItemsTable.chaveAtivacao,
      })
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.fkCarrinho, cartId), eq(cartItemsTable.fkJogo, gameId)))
      .limit(1);

    return cartItem ?? null;
  }

  async create(userId: number, executor?: any) {
    const db = this.getExecutor(executor);
    const [createdCart] = await db
      .insert(cartsTable)
      .values({ fkUsuario: userId })
      .returning();

    return createdCart;
  }

  async createItem(payload: { fkJogo: number; fkCarrinho: number }, executor?: any) {
    const db = this.getExecutor(executor);
    const [createdCartItem] = await db
      .insert(cartItemsTable)
      .values(payload)
      .returning({
        id: cartItemsTable.id,
        fkJogo: cartItemsTable.fkJogo,
        fkCarrinho: cartItemsTable.fkCarrinho,
        chaveAtivacao: cartItemsTable.chaveAtivacao,
      });

    return createdCartItem;
  }

  async updateActivationKey(id: number, chaveAtivacao: string, executor?: any) {
    const db = this.getExecutor(executor);
    const updatedItems = await db
      .update(cartItemsTable)
      .set({ chaveAtivacao })
      .where(eq(cartItemsTable.id, id))
      .returning({ id: cartItemsTable.id });

    return updatedItems.length;
  }

  async finalize(cartId: number, saleId: number, executor?: any) {
    const db = this.getExecutor(executor);
    const finalizedCarts = await db
      .update(cartsTable)
      .set({ status: 'F', fkVenda: saleId })
      .where(eq(cartsTable.id, cartId))
      .returning({ id: cartsTable.id });

    return finalizedCarts.length;
  }

  async deleteItem(id: number, executor?: any) {
    const db = this.getExecutor(executor);
    const deletedItems = await db
      .delete(cartItemsTable)
      .where(eq(cartItemsTable.id, id))
      .returning({ id: cartItemsTable.id });

    return deletedItems.length;
  }
}


