import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from '../profiles/profiles.service';
import { parseBirthDateInput } from '../../shared/utils/date.util';
import { hashPassword, verifyPassword } from '../../shared/utils/password.util';
import { UsersRepository } from '../users/users.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profilesService: ProfilesService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const nome = registerDto.nome?.trim() || registerDto.name?.trim();
    const senha = registerDto.senha?.trim() || registerDto.password?.trim();
    const dataNascimento = registerDto.dataNascimento ?? registerDto.dateOfBirth;

    if (!nome || !registerDto.email || !senha) {
      throw new BadRequestException('Todos os campos sÃ£o obrigatÃ³rios.');
    }

    const parsedBirthDate = parseBirthDateInput(dataNascimento);
    if (dataNascimento && !parsedBirthDate) {
      throw new BadRequestException('Data de nascimento invÃ¡lida.');
    }

    const existingUser = await this.usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('E-mail jÃ¡ cadastrado.');
    }

    const clientProfile = await this.profilesService.getClientProfileOrThrow();
    const hashedPassword = await hashPassword(senha);

    const createdUser = await this.usersRepository.create({
      nome,
      email: registerDto.email,
      senha: hashedPassword,
      dataNascimento: parsedBirthDate,
      fkPerfil: clientProfile.id,
    });

    return {
      message: 'UsuÃ¡rio cadastrado com sucesso!',
      userId: createdUser.id,
    };
  }

  async login(loginDto: LoginDto) {
    const senha = loginDto.senha?.trim() || loginDto.password?.trim();
    if (!loginDto.email || !senha) {
      throw new BadRequestException('E-mail e senha sÃ£o obrigatÃ³rios.');
    }

    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('UsuÃ¡rio nÃ£o encontrado.');
    }

    const isPasswordValid = await verifyPassword(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais invÃ¡lidas.');
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
      nome: user.nome,
      perfil: user.perfil,
    });

    return {
      message: 'Login bem-sucedido!',
      token,
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('UsuÃ¡rio nÃ£o encontrado.');
    }

    const isCurrentPasswordValid = await verifyPassword(
      changePasswordDto.currentPassword,
      user.senha,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    const hashedPassword = await hashPassword(changePasswordDto.newPassword);
    await this.usersRepository.updatePassword(userId, hashedPassword);

    return { message: 'Senha alterada com sucesso!' };
  }

  async forgotPassword(_: ForgotPasswordDto) {
    return {
      message:
        'Se o e-mail informado existir, um fluxo de recuperaÃ§Ã£o serÃ¡ iniciado.',
    };
  }
}


