import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../infra/database/database.service';
import { cartItemsTable, cartsTable, gamesTable, profilesTable, usersTable } from '../../infra/database/schema';

interface CreateUserPayload {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: Date | null;
  fkPerfil: number;
}

interface UpdateUserPayload {
  nome: string;
  dataNascimento: Date | null;
  fkPerfil: number;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.db
      .select({
        id: usersTable.id,
        nome: usersTable.nome,
        email: usersTable.email,
        dataNascimento: usersTable.dataNascimento,
        fkPerfil: usersTable.fkPerfil,
      })
      .from(usersTable)
      .orderBy(asc(usersTable.id));
  }

  async findById(id: number) {
    const [user] = await this.databaseService.db
      .select({
        id: usersTable.id,
        nome: usersTable.nome,
        email: usersTable.email,
        dataNascimento: usersTable.dataNascimento,
        fkPerfil: usersTable.fkPerfil,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user ?? null;
  }

  async findByIdWithPassword(id: number) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user ?? null;
  }

  async findByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select({
        id: usersTable.id,
        nome: usersTable.nome,
        email: usersTable.email,
        senha: usersTable.senha,
        dataNascimento: usersTable.dataNascimento,
        fkPerfil: usersTable.fkPerfil,
        perfil: profilesTable.nome,
      })
      .from(usersTable)
      .innerJoin(profilesTable, eq(usersTable.fkPerfil, profilesTable.id))
      .where(eq(usersTable.email, email))
      .limit(1);

    return user ?? null;
  }

  async create(payload: CreateUserPayload) {
    const [createdUser] = await this.databaseService.db
      .insert(usersTable)
      .values(payload)
      .returning({
        id: usersTable.id,
        nome: usersTable.nome,
        email: usersTable.email,
        dataNascimento: usersTable.dataNascimento,
        fkPerfil: usersTable.fkPerfil,
      });

    return createdUser;
  }

  async update(id: number, payload: UpdateUserPayload) {
    const updatedUsers = await this.databaseService.db
      .update(usersTable)
      .set(payload)
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });

    return updatedUsers.length;
  }

  async updatePassword(id: number, senha: string) {
    const updatedUsers = await this.databaseService.db
      .update(usersTable)
      .set({ senha })
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });

    return updatedUsers.length;
  }

  async findOwnedGames(userId: number) {
    const rows = await this.databaseService.db
      .select({
        chaveAtivacao: cartItemsTable.chaveAtivacao,
        jogoId: gamesTable.id,
        nome: gamesTable.nome,
        ano: gamesTable.ano,
        preco: gamesTable.preco,
        desconto: gamesTable.desconto,
        descricao: gamesTable.descricao,
        fkEmpresa: gamesTable.fkEmpresa,
        fkCategoria: gamesTable.fkCategoria,
      })
      .from(cartItemsTable)
      .innerJoin(cartsTable, eq(cartItemsTable.fkCarrinho, cartsTable.id))
      .innerJoin(gamesTable, eq(cartItemsTable.fkJogo, gamesTable.id))
      .where(and(eq(cartsTable.fkUsuario, userId), eq(cartsTable.status, 'F')))
      .orderBy(desc(cartsTable.id), asc(gamesTable.nome));

    return rows.map((row) => ({
      chaveAtivacao: row.chaveAtivacao,
      jogo: {
        id: row.jogoId,
        nome: row.nome,
        ano: row.ano,
        preco: row.preco,
        desconto: row.desconto,
        descricao: row.descricao,
        fkEmpresa: row.fkEmpresa,
        fkCategoria: row.fkCategoria,
      },
    }));
  }
}


