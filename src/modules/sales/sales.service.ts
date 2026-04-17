import { BadRequestException, Injectable } from '@nestjs/common';
import { CartsRepository } from '../carts/carts.repository';
import { GamesRepository } from '../games/games.repository';
import { DatabaseService } from '../../infra/database/database.service';
import { generateActivationKey } from '../../shared/utils/activation-key.util';
import { roundCurrency } from '../../shared/utils/money.util';
import { PaySaleDto } from './dto/pay-sale.dto';
import { SalesRepository } from './sales.repository';
import { BoletoStrategy } from './strategies/boleto.strategy';
import { CreditCardStrategy } from './strategies/credit-card.strategy';
import { PixStrategy } from './strategies/pix.strategy';

@Injectable()
export class SalesService {
  private readonly paymentStrategies = {
    cartao: new CreditCardStrategy(),
    boleto: new BoletoStrategy(),
    pix: new PixStrategy(),
  };

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly salesRepository: SalesRepository,
    private readonly cartsRepository: CartsRepository,
    private readonly gamesRepository: GamesRepository,
  ) {}

  async checkout(userId: number) {
    const activeCart = await this.cartsRepository.findActiveByUser(userId);
    if (!activeCart) {
      return { message: 'Carrinho vazio.' };
    }

    const items = await this.cartsRepository.findItemsByCartId(activeCart.id);
    if (items.length === 0) {
      return { message: 'Carrinho vazio.' };
    }

    const games = await Promise.all(
      items.map((item) => this.gamesRepository.findById(item.fkJogo)),
    );
    const validGames = games.filter((game): game is NonNullable<typeof game> => Boolean(game));
    const totalAmount = roundCurrency(
      validGames.reduce((accumulator, game) => accumulator + Number(game.preco), 0),
    );

    const createdSale = await this.databaseService.db.transaction(async (transaction) => {
      const sale = await this.salesRepository.create(
        {
          fkUsuario: userId,
          valorTotal: totalAmount,
          quantidade: items.length,
          data: new Date(),
        },
        transaction,
      );

      for (const item of items) {
        await this.cartsRepository.updateActivationKey(
          item.id,
          generateActivationKey(),
          transaction,
        );
      }

      await this.cartsRepository.finalize(activeCart.id, sale.id, transaction);
      return sale;
    });

    return {
      message: 'Compra realizada com sucesso!',
      venda: createdSale,
    };
  }

  async history(userId: number) {
    return this.salesRepository.findByUser(userId);
  }

  async pay(paySaleDto: PaySaleDto) {
    const strategy = this.paymentStrategies[paySaleDto.metodo as keyof typeof this.paymentStrategies];
    if (!strategy) {
      throw new BadRequestException(`MÃ©todo de pagamento "${paySaleDto.metodo}" nÃ£o suportado.`);
    }

    const resultado = await strategy.processarPagamento(paySaleDto.dados);
    return {
      message: 'Pagamento processado com sucesso.',
      resultado,
    };
  }
}


