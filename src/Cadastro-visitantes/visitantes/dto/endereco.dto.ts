import { IsOptional, IsString } from 'class-validator';

export class EnderecoDto {
  @IsString()
  rua: string;

  @IsString()
  numero: string;

  @IsString()
  bairro: string;
  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string; 
}
