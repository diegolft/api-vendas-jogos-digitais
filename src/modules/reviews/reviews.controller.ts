import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('avaliacoes')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() upsertReviewDto: UpsertReviewDto,
  ) {
    return this.reviewsService.create(user.id, upsertReviewDto);
  }

  @Put()
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() upsertReviewDto: UpsertReviewDto,
  ) {
    return this.reviewsService.update(user.id, upsertReviewDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() listReviewsDto: ListReviewsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const reviews = await this.reviewsService.findAll(user.id, listReviewsDto);
    if (!reviews || (Array.isArray(reviews) && reviews.length === 0)) {
      response.status(204);
      return;
    }

    return reviews;
  }

  @Get('media/:jogoId')
  async findAverageByGame(
    @Param('jogoId', ParseIntPipe) gameId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const average = await this.reviewsService.findAverageByGame(gameId);
    if (!average) {
      response.status(204);
      return;
    }

    return average;
  }
}


