import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { CompaniesModule } from '../companies/companies.module';
import { GamesController } from './games.controller';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';
import { PublicGamesController } from './public-games.controller';

@Module({
  imports: [CompaniesModule, CategoriesModule],
  controllers: [GamesController, PublicGamesController],
  providers: [GamesRepository, GamesService],
  exports: [GamesRepository, GamesService],
})
export class GamesModule {}

