import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import { SWAGGER_BEARER_NAME } from '../../shared/constants/swagger.constants';
import { Roles } from '../../shared/decorators/roles.decorator';
import { ListGamesDto } from './dto/list-games.dto';
import { UpsertGameDto } from './dto/upsert-game.dto';
import { GamesService } from './games.service';

@ApiTags('Jogos (admin)')
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('jogos')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async findAll(
    @Query() listGamesDto: ListGamesDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const games = await this.gamesService.findAll(listGamesDto);
    if (games.length === 0) {
      response.status(204);
      return;
    }

    return games;
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const game = await this.gamesService.findById(id);
    if (!game) {
      response.status(204);
      return;
    }

    return game;
  }

  @Post()
  @Roles(PROFILE_NAMES.ADMIN)
  async create(@Body() upsertGameDto: UpsertGameDto) {
    return this.gamesService.create(upsertGameDto);
  }

  @Put(':id')
  @Roles(PROFILE_NAMES.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() upsertGameDto: UpsertGameDto,
  ) {
    return this.gamesService.update(id, upsertGameDto);
  }

  @Delete(':id')
  @Roles(PROFILE_NAMES.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.gamesService.delete(id);
    return 'Jogo removido com sucesso.';
  }
}


