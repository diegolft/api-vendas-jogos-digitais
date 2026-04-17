import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async findAll() {
    return this.profilesRepository.findAll();
  }

  async findByName(nome: string) {
    return this.profilesRepository.findByName(nome);
  }

  async getClientProfileOrThrow() {
    await this.profilesRepository.ensureBaseProfiles();
    const profile = await this.profilesRepository.findByName(PROFILE_NAMES.CLIENT);
    if (!profile) {
      throw new InternalServerErrorException('Perfil de cliente não encontrado.');
    }

    return profile;
  }

  async create(createProfileDto: CreateProfileDto) {
    const existingProfile = await this.profilesRepository.findByName(createProfileDto.nome);
    if (existingProfile) {
      throw new ConflictException('Este perfil já existe.');
    }

    return this.profilesRepository.create(createProfileDto.nome);
  }
}


