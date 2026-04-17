import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ManageCompanyDto } from './dto/manage-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll(searchCompanyDto: SearchCompanyDto) {
    return this.companiesRepository.findAll(searchCompanyDto.nome);
  }

  async findById(id: number) {
    return this.companiesRepository.findById(id);
  }

  async create(manageCompanyDto: ManageCompanyDto) {
    const existingCompany = await this.companiesRepository.findByName(manageCompanyDto.nome);
    if (existingCompany) {
      throw new ConflictException('Empresa jÃ¡ cadastrada.');
    }

    return this.companiesRepository.create(manageCompanyDto.nome);
  }

  async update(id: number, manageCompanyDto: ManageCompanyDto) {
    const existingCompany = await this.companiesRepository.findById(id);
    if (!existingCompany) {
      throw new NotFoundException('Empresa nÃ£o encontrada.');
    }

    const duplicateCompany = await this.companiesRepository.findByName(
      manageCompanyDto.nome,
      id,
    );
    if (duplicateCompany) {
      throw new ConflictException('Empresa jÃ¡ cadastrada.');
    }

    return this.companiesRepository.update(id, manageCompanyDto.nome);
  }

  async delete(id: number) {
    const deletedCompanies = await this.companiesRepository.delete(id);
    if (deletedCompanies === 0) {
      throw new NotFoundException('Empresa nÃ£o encontrada.');
    }
  }
}


