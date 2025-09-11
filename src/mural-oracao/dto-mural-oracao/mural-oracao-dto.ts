import { IsString, MaxLength, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateMuralOracaoDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres' })
  nome?: string;

  @IsString({ message: 'O pedido de oração deve ser uma string' })
  pedido_oracao?: string;

  @IsOptional()
  @IsDateString()
  data_criacao?: string;

  @IsOptional()
  @IsNumber({}, { message: 'interacoes deve ser um número' })
  interacoes?: number;
}

