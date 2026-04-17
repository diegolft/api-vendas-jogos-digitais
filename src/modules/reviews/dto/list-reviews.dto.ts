import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ListReviewsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  jogoId?: number;
}


