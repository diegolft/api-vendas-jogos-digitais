import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import { SWAGGER_BEARER_NAME } from '../../shared/constants/swagger.constants';
import { Roles } from '../../shared/decorators/roles.decorator';
import { ManageCompanyDto } from './dto/manage-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompaniesService } from './companies.service';

@ApiTags('Empresas')
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('empresas')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(
    @Query() searchCompanyDto: SearchCompanyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const companies = await this.companiesService.findAll(searchCompanyDto);
    if (companies.length === 0) {
      response.status(204);
      return;
    }

    return companies;
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const company = await this.companiesService.findById(id);
    if (!company) {
      response.status(204);
      return;
    }

    return company;
  }

  @Post()
  @Roles(PROFILE_NAMES.ADMIN)
  async create(@Body() manageCompanyDto: ManageCompanyDto) {
    return this.companiesService.create(manageCompanyDto);
  }

  @Put(':id')
  @Roles(PROFILE_NAMES.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() manageCompanyDto: ManageCompanyDto,
  ) {
    return this.companiesService.update(id, manageCompanyDto);
  }

  @Delete(':id')
  @Roles(PROFILE_NAMES.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.companiesService.delete(id);
    return 'Empresa removida com sucesso.';
  }
}


