import { Module } from '@nestjs/common';
import { CartsModule } from '../carts/carts.module';
import { GamesModule } from '../games/games.module';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

@Module({
  imports: [CartsModule, GamesModule],
  controllers: [SalesController],
  providers: [SalesRepository, SalesService],
})
export class SalesModule {}

