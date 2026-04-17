import { Body, Controller, Get, Post } from '@nestjs/common';
import { PROFILE_NAMES } from '../../shared/constants/profile.constants';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async findAll() {
    return this.profilesService.findAll();
  }

  @Post()
  @Roles(PROFILE_NAMES.ADMIN)
  async create(@Body() createProfileDto: CreateProfileDto) {
    const createdProfile = await this.profilesService.create(createProfileDto);
    return {
      message: 'Perfil criado com sucesso!',
      profileId: createdProfile.id,
    };
  }
}


