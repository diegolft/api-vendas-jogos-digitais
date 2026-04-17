import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CategoriesService } from './categories.service';

@Controller('categorias')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Res({ passthrough: true }) response: Response) {
    const categories = await this.categoriesService.findAll();
    if (categories.length === 0) {
      response.status(204);
      return;
    }

    return categories;
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category) {
      response.status(204);
      return;
    }

    return category;
  }
}


