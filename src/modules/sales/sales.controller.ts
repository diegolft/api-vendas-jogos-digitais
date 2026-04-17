import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from '../../shared/constants/swagger.constants';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';
import { PaySaleDto } from './dto/pay-sale.dto';
import { SalesService } from './sales.service';

@ApiTags('Vendas')
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('vendas')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async history(@CurrentUser() user: AuthenticatedUser) {
    return this.salesService.history(user.id);
  }

  @Post('checkout')
  async checkout(@CurrentUser() user: AuthenticatedUser) {
    return this.salesService.checkout(user.id);
  }

  @Post('pay')
  async pay(@Body() paySaleDto: PaySaleDto) {
    return this.salesService.pay(paySaleDto);
  }
}


