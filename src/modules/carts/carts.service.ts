import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly gamesService: GamesService,
  ) {}

  async findAll(userId: number) {
    const carts = await this.cartsRepository.findByUser(userId);
    const cartsWithItems = await Promise.all(
      carts.map(async (cart) => ({
        ...cart,
        itens: await this.cartsRepository.findItemsByCartId(cart.id),
      })),
    );

    return { carrinhosComItens: cartsWithItems };
  }

  async findActive(userId: number) {
    const activeCart = await this.cartsRepository.findActiveByUser(userId);
    if (!activeCart) {
      return { message: 'Carrinho vazio.' };
    }

    const items = await this.cartsRepository.findItemsByCartId(activeCart.id);
    return {
      carrinho: {
        ...activeCart,
        itens: items,
      },
    };
  }

  async add(userId: number, addCartItemDto: AddCartItemDto) {
    const game = await this.gamesService.findById(addCartItemDto.jogoId);
    if (!game) {
      throw new NotFoundException('Jogo nÃ£o encontrado.');
    }

    let activeCart = await this.cartsRepository.findActiveByUser(userId);
    if (!activeCart) {
      activeCart = await this.cartsRepository.create(userId);
    }

    const existingItem = await this.cartsRepository.findActiveByUserAndGame(
      userId,
      addCartItemDto.jogoId,
    );
    if (existingItem) {
      throw new BadRequestException('Jogo jÃ¡ estÃ¡ no carrinho.');
    }

    await this.cartsRepository.createItem({
      fkJogo: addCartItemDto.jogoId,
      fkCarrinho: activeCart.id,
    });

    const items = await this.cartsRepository.findItemsByCartId(activeCart.id);
    return {
      message: 'Jogo adicionado ao carrinho com sucesso!',
      carrinho: {
        ...activeCart,
        itens: items,
      },
    };
  }

  async removeFromCart(userId: number, gameId: number) {
    const activeCart = await this.cartsRepository.findActiveByUser(userId);
    if (!activeCart) {
      throw new BadRequestException('Carrinho encontra-se vazio.');
    }

    const cartItem = await this.cartsRepository.findItemByCartAndGame(activeCart.id, gameId);
    if (!cartItem) {
      throw new NotFoundException('Jogo nÃ£o encontrado no seu carrinho.');
    }

    await this.cartsRepository.deleteItem(cartItem.id);
    return { message: 'Jogo removido do carrinho com sucesso!' };
  }
}


