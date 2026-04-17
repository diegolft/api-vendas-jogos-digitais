export interface PaymentStrategy {
  processarPagamento(dadosPagamento?: Record<string, unknown>): Promise<{
    status: string;
    metodo: string;
  }>;
}


