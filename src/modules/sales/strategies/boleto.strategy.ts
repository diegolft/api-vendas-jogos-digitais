import type { PaymentStrategy } from './payment-strategy';

export class BoletoStrategy implements PaymentStrategy {
  async processarPagamento(
    _dadosPagamento?: Record<string, unknown>,
  ): Promise<{ status: string; metodo: string }> {
    return {
      status: 'sucesso',
      metodo: 'Boleto',
    };
  }
}

