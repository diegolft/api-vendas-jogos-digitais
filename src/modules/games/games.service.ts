import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { CompaniesService } from '../companies/companies.service';
import { ListGamesDto } from './dto/list-games.dto';
import { UpsertGameDto } from './dto/upsert-game.dto';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly categoriesService: CategoriesService,
    private readonly companiesService: CompaniesService,
  ) {}

  async findAll(listGamesDto: ListGamesDto) {
    return this.gamesRepository.findAll(listGamesDto.categoria);
  }

  async findExhibition() {
    return this.gamesRepository.findExhibition();
  }

  async findById(id: number) {
    return this.gamesRepository.findById(id);
  }

  async create(upsertGameDto: UpsertGameDto) {
    const category = await this.categoriesService.findById(upsertGameDto.fkCategoria);
    if (!category) {
      throw new NotFoundException('Categoria nÃ£o encontrada.');
    }

    const company = await this.companiesService.findById(upsertGameDto.fkEmpresa);
    if (!company) {
      throw new NotFoundException('Empresa nÃ£o encontrada.');
    }

    const existingGame = await this.gamesRepository.findByNameAndCompany(
      upsertGameDto.nome,
      upsertGameDto.fkEmpresa,
    );
    if (existingGame) {
      throw new ConflictException('Jogo jÃ¡ cadastrado para esta empresa.');
    }

    return this.gamesRepository.create(upsertGameDto);
  }

  async update(id: number, upsertGameDto: UpsertGameDto) {
    const existingGame = await this.gamesRepository.findById(id);
    if (!existingGame) {
      throw new NotFoundException('Jogo nÃ£o encontrado.');
    }

    const category = await this.categoriesService.findById(upsertGameDto.fkCategoria);
    if (!category) {
      throw new NotFoundException('Categoria nÃ£o encontrada.');
    }

    const company = await this.companiesService.findById(upsertGameDto.fkEmpresa);
    if (!company) {
      throw new NotFoundException('Empresa nÃ£o encontrada.');
    }

    const duplicateGame = await this.gamesRepository.findByNameAndCompany(
      upsertGameDto.nome,
      upsertGameDto.fkEmpresa,
      id,
    );
    if (duplicateGame) {
      throw new ConflictException('Jogo jÃ¡ cadastrado para esta empresa.');
    }

    const changes = await this.gamesRepository.update(id, upsertGameDto);
    return { changes };
  }

  async delete(id: number) {
    const deletedGames = await this.gamesRepository.delete(id);
    if (deletedGames === 0) {
      throw new NotFoundException('Jogo nÃ£o encontrado.');
    }
  }
}


