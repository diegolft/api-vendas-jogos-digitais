import { Type } from 'class-transformer';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class PaySaleDto {
  @IsString()
  @IsIn(['cartao', 'boleto', 'pix'])
  metodo!: string;

  @IsOptional()
  @Type(() => Object)
  @IsObject()
  dados?: Record<string, unknown>;
}


