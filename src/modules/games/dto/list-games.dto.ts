import { IsOptional, IsString } from 'class-validator';

export class ListGamesDto {
  @IsOptional()
  @IsString()
  categoria?: string;
}


