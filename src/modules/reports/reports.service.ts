import { Injectable } from '@nestjs/common';
import { MostSoldGamesReportDto } from './dto/most-sold-games-report.dto';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async mostSoldGames(mostSoldGamesReportDto: MostSoldGamesReportDto) {
    const top = mostSoldGamesReportDto.top ?? 10;
    const games = await this.reportsRepository.countMostSold(
      top,
      mostSoldGamesReportDto.empresa,
    );

    return games.map((game) => ({
      ...game,
      total: Number(game.total),
    }));
  }
}

