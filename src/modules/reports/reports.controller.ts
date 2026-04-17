import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { SWAGGER_BEARER_NAME } from '../../shared/constants/swagger.constants';
import { MostSoldGamesReportDto } from './dto/most-sold-games-report.dto';
import { ReportsService } from './reports.service';

@ApiTags('Relatórios')
@ApiBearerAuth(SWAGGER_BEARER_NAME)
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


