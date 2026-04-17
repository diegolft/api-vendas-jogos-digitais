import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from '../../shared/constants/swagger.constants';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';
import { WishlistGameDto } from './dto/wishlist-game.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Lista de desejos')
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('lista-desejo')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async findByUser(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.findByUser(user.id);
  }

  @Post()
  async add(
    @CurrentUser() user: AuthenticatedUser,
    @Body() wishlistGameDto: WishlistGameDto,
  ) {
    return this.wishlistService.add(user.id, wishlistGameDto);
  }

  @Delete()
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Body() wishlistGameDto: WishlistGameDto,
  ) {
    return this.wishlistService.remove(user.id, wishlistGameDto);
  }
}


