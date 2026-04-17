import type { PaymentStrategy } from './payment-strategy';

export class CreditCardStrategy implements PaymentStrategy {
  async processarPagamento(
    _dadosPagamento?: Record<string, unknown>,
  ): Promise<{ status: string; metodo: string }> {
    return {
      status: 'sucesso',
      metodo: 'CartÃ£o de CrÃ©dito',
    };
  }
}

