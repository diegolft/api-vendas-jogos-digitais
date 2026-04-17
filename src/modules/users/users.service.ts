import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import type { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';
import { formatBirthDate, parseBirthDateInput } from '../../shared/utils/date.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users.map((user) => ({
      ...user,
      dataNascimento: formatBirthDate(user.dataNascimento),
    }));
  }

  async findById(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      return null;
    }

    return {
      ...user,
      dataNascimento: formatBirthDate(user.dataNascimento),
    };
  }

  async findOwnedGames(userId: number) {
    return this.usersRepository.findOwnedGames(userId);
  }

  async update(requester: AuthenticatedUser, id: number, updateUserDto: UpdateUserDto) {
    const canManageTargetUser =
      requester.id === id || requester.perfil === PROFILE_NAMES.ADMIN;

    if (!canManageTargetUser) {
      throw new ForbiddenException('VocÃª nÃ£o pode atualizar outro usuÃ¡rio.');
    }

    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('UsuÃ¡rio nÃ£o encontrado.');
    }

    const parsedBirthDate = parseBirthDateInput(updateUserDto.dataNascimento);
    if (updateUserDto.dataNascimento && !parsedBirthDate) {
      throw new BadRequestException('Data de nascimento invÃ¡lida.');
    }

    let fkPerfil = updateUserDto.fkPerfil;
    if (!fkPerfil) {
      const clientProfile = await this.profilesService.getClientProfileOrThrow();
      fkPerfil = clientProfile.id;
    }

    await this.usersRepository.update(id, {
      nome: updateUserDto.nome,
      dataNascimento: parsedBirthDate,
      fkPerfil,
    });

    return { message: 'UsuÃ¡rio atualizado com sucesso.' };
  }
}


