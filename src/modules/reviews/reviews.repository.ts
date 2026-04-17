import { Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { reviewsTable } from '../../infra/database/schema';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByUserAndGame(userId: number, gameId: number) {
    const [review] = await this.databaseService.db
      .select()
      .from(reviewsTable)
      .where(and(eq(reviewsTable.fkUsuario, userId), eq(reviewsTable.fkJogo, gameId)))
      .limit(1);

    return review ?? null;
  }

  async findByGame(gameId: number) {
    return this.databaseService.db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.fkJogo, gameId))
      .orderBy(desc(reviewsTable.data));
  }

  async findByUser(userId: number) {
    return this.databaseService.db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.fkUsuario, userId))
      .orderBy(desc(reviewsTable.data));
  }

  async create(payload: {
    fkUsuario: number;
    fkJogo: number;
    nota: number;
    comentario: string;
  }) {
    const [createdReview] = await this.databaseService.db
      .insert(reviewsTable)
      .values({
        ...payload,
        data: new Date(),
      })
      .returning();

    return createdReview;
  }

  async update(
    id: number,
    payload: {
      nota: number;
      comentario: string;
    },
  ) {
    const updatedReviews = await this.databaseService.db
      .update(reviewsTable)
      .set({
        ...payload,
        data: new Date(),
      })
      .where(eq(reviewsTable.id, id))
      .returning({ id: reviewsTable.id });

    return updatedReviews.length;
  }
}


