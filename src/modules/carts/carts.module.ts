import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';
import { CartsService } from './carts.service';

@Module({
  imports: [GamesModule],
  controllers: [CartsController],
  providers: [CartsRepository, CartsService],
  exports: [CartsRepository, CartsService],
})
export class CartsModule {}

