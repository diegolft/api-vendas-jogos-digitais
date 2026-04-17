import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AddCartItemDto {
  @Type(() => Number)
  @IsInt()
  jogoId!: number;
}


