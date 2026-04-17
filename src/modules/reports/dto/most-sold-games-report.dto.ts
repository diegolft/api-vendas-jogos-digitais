import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MostSoldGamesReportDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  top?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empresa?: number;
}


