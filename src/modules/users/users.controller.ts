import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import { SWAGGER_BEARER_NAME } from '../../shared/constants/swagger.constants';
import type { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Usuários')
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my/games')
  async findOwnedGames(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const games = await this.usersService.findOwnedGames(user.id);
    if (games.length === 0) {
      response.status(204);
      return;
    }

    return games;
  }

  @Get()
  @Roles(PROFILE_NAMES.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) {
      response.status(204);
      return;
    }

    return user;
  }

  @Put(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user, id, updateUserDto);
  }
}


