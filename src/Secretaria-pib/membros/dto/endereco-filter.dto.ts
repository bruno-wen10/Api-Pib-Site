import { IsOptional, IsString, IsDateString } from 'class-validator';

export class EnderecoFilterDto {
  @IsOptional()
  @IsString()
  rua?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cep?: string;
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsDateString()
  createdAtStart?: string;

  @IsOptional()
  @IsDateString()
  createdAtEnd?: string;

  @IsOptional()
  @IsDateString()
  updatedAtStart?: string;

  @IsOptional()
  @IsDateString()
  updatedAtEnd?: string;
}
