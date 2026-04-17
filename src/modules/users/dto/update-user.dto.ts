import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsOptional()
  @IsString()
  dataNascimento?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fkPerfil?: number;
}


