import { Injectable } from '@nestjs/common';
import { and, asc, eq, ilike, ne } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { categoriesTable, companiesTable, gamesTable } from '../../infra/database/schema';
import { UpsertGameDto } from './dto/upsert-game.dto';

@Injectable()
export class GamesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(categoria?: string) {
    if (categoria) {
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
        .from(gamesTable)
        .innerJoin(categoriesTable, eq(gamesTable.fkCategoria, categoriesTable.id))
        .where(ilike(categoriesTable.nome, `%${categoria}%`))
        .orderBy(asc(gamesTable.nome));
    }

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
      .from(gamesTable)
      .orderBy(asc(gamesTable.nome));
  }

  async findExhibition() {
    return this.databaseService.db
      .select({
        nome: gamesTable.nome,
        descricao: gamesTable.descricao,
        ano: gamesTable.ano,
        preco: gamesTable.preco,
        desconto: gamesTable.desconto,
        categoria: categoriesTable.nome,
        empresa_nome: companiesTable.nome,
      })
      .from(gamesTable)
      .innerJoin(categoriesTable, eq(gamesTable.fkCategoria, categoriesTable.id))
      .innerJoin(companiesTable, eq(gamesTable.fkEmpresa, companiesTable.id))
      .orderBy(asc(gamesTable.nome));
  }

  async findById(id: number) {
    const [game] = await this.databaseService.db
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
      .from(gamesTable)
      .where(eq(gamesTable.id, id))
      .limit(1);

    return game ?? null;
  }

  async findByNameAndCompany(nome: string, fkEmpresa: number, ignoreId?: number) {
    const [game] = await this.databaseService.db
      .select({
        id: gamesTable.id,
        nome: gamesTable.nome,
      })
      .from(gamesTable)
      .where(
        ignoreId
          ? and(
              eq(gamesTable.nome, nome),
              eq(gamesTable.fkEmpresa, fkEmpresa),
              ne(gamesTable.id, ignoreId),
            )
          : and(eq(gamesTable.nome, nome), eq(gamesTable.fkEmpresa, fkEmpresa)),
      )
      .limit(1);

    return game ?? null;
  }

  async create(upsertGameDto: UpsertGameDto) {
    const [createdGame] = await this.databaseService.db
      .insert(gamesTable)
      .values({
        nome: upsertGameDto.nome,
        descricao: upsertGameDto.descricao ?? null,
        ano: upsertGameDto.ano,
        preco: upsertGameDto.preco,
        desconto: upsertGameDto.desconto ?? 0,
        fkEmpresa: upsertGameDto.fkEmpresa,
        fkCategoria: upsertGameDto.fkCategoria,
      })
      .returning({
        id: gamesTable.id,
        nome: gamesTable.nome,
        ano: gamesTable.ano,
        preco: gamesTable.preco,
        desconto: gamesTable.desconto,
        descricao: gamesTable.descricao,
        fkEmpresa: gamesTable.fkEmpresa,
        fkCategoria: gamesTable.fkCategoria,
      });

    return createdGame;
  }

  async update(id: number, upsertGameDto: UpsertGameDto) {
    const updatedGames = await this.databaseService.db
      .update(gamesTable)
      .set({
        nome: upsertGameDto.nome,
        descricao: upsertGameDto.descricao ?? null,
        ano: upsertGameDto.ano,
        preco: upsertGameDto.preco,
        desconto: upsertGameDto.desconto ?? 0,
        fkEmpresa: upsertGameDto.fkEmpresa,
        fkCategoria: upsertGameDto.fkCategoria,
      })
      .where(eq(gamesTable.id, id))
      .returning({ id: gamesTable.id });

    return updatedGames.length;
  }

  async delete(id: number) {
    const deletedGames = await this.databaseService.db
      .delete(gamesTable)
      .where(eq(gamesTable.id, id))
      .returning({ id: gamesTable.id });

    return deletedGames.length;
  }
}


