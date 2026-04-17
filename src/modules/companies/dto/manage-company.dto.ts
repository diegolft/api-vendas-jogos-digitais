import { IsNotEmpty, IsString } from 'class-validator';

export class ManageCompanyDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;
}


