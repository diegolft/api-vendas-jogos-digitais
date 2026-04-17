import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartsService } from './carts.service';

@Controller('carrinho')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.cartsService.findAll(user.id);
  }

  @Get('ativo')
  async findActive(@CurrentUser() user: AuthenticatedUser) {
    return this.cartsService.findActive(user.id);
  }

  @Post('add')
  async add(
    @CurrentUser() user: AuthenticatedUser,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return this.cartsService.add(user.id, addCartItemDto);
  }

  @Delete(':gameId')
  async removeFromCart(
    @CurrentUser() user: AuthenticatedUser,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.cartsService.removeFromCart(user.id, gameId);
  }
}


