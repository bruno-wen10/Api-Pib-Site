import { IsString, IsOptional, IsBoolean, IsDate, IsArray } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  lideranca_responsavel: string;

  @IsOptional()
  @IsString()
  inscricao?: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  data_evento_inicio_inscricao?: string;

  @IsOptional()
  @IsString()
  data_evento_fim_inscricao?: string;

  @IsString()
  local: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  sobre_evento?: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @IsOptional()
  @IsDate()
  dataInicio_evento?: Date;

  @IsOptional()
  @IsDate()
  dataFim_evento?: Date;

  @IsOptional()
  @IsArray()
  fotos?: string[];

  @IsOptional()
  @IsArray()
  videos?: string[];
}
