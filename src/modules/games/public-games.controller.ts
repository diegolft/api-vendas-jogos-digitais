import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../../shared/decorators/public.decorator';
import { GamesService } from './games.service';

@ApiTags('Público')
@Controller('public')
export class PublicGamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Public()
  @Get('jogos')
  async findExhibition(@Res({ passthrough: true }) response: Response) {
    const games = await this.gamesService.findExhibition();
    if (games.length === 0) {
      response.status(204);
      return;
    }

    return games;
  }
}


