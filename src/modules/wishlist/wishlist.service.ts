import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { WishlistGameDto } from './dto/wishlist-game.dto';
import { WishlistRepository } from './wishlist.repository';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly gamesService: GamesService,
  ) {}

  async add(userId: number, wishlistGameDto: WishlistGameDto) {
    const game = await this.gamesService.findById(wishlistGameDto.jogoId);
    if (!game) {
      throw new NotFoundException('Jogo nÃ£o encontrado.');
    }

    const alreadyExists = await this.wishlistRepository.exists(userId, wishlistGameDto.jogoId);
    if (alreadyExists) {
      throw new ConflictException('Jogo jÃ¡ estÃ¡ na lista de desejo.');
    }

    return this.wishlistRepository.add(userId, wishlistGameDto.jogoId);
  }

  async findByUser(userId: number) {
    return this.wishlistRepository.getByUser(userId);
  }

  async remove(userId: number, wishlistGameDto: WishlistGameDto) {
    const entry = await this.wishlistRepository.findByGameAndUser(userId, wishlistGameDto.jogoId);
    if (!entry) {
      throw new ConflictException('Jogo nÃ£o estÃ¡ na lista de desejo.');
    }

    await this.wishlistRepository.remove(entry.id);
    return { message: 'Jogo removido da lista de desejo com sucesso.' };
  }
}


