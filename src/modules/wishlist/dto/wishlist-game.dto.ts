import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class WishlistGameDto {
  @Type(() => Number)
  @IsInt()
  jogoId!: number;
}


