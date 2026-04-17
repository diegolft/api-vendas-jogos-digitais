import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MostSoldGamesReportDto } from './dto/most-sold-games-report.dto';
import { ReportsService } from './reports.service';

@Controller('relatorios')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('jogos-mais-vendidos')
  async mostSoldGames(
    @Query() mostSoldGamesReportDto: MostSoldGamesReportDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const games = await this.reportsService.mostSoldGames(mostSoldGamesReportDto);
    if (games.length === 0) {
      response.status(204);
      return;
    }

    return games;
  }
}


