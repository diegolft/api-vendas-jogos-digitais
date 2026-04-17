import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertGameDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco!: number;

  @Type(() => Number)
  @IsInt()
  ano!: number;

  @Type(() => Number)
  @IsInt()
  fkCategoria!: number;

  @Type(() => Number)
  @IsInt()
  fkEmpresa!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  desconto?: number;
}


