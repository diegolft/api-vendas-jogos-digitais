import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { WishlistController } from './wishlist.controller';
import { WishlistRepository } from './wishlist.repository';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [GamesModule],
  controllers: [WishlistController],
  providers: [WishlistRepository, WishlistService],
})
export class WishlistModule {}


