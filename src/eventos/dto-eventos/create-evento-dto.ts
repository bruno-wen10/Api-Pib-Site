import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsDate, 
  ValidateNested 
} from 'class-validator';
import { EventoFotosDto } from '../eventos-fotos/dto-eventos-fotos/eventos-fotos-dto';
import { EventoVideosDto } from '../eventos-videos/dto-eventos/eventos-videos-dto';
import { Type } from 'class-transformer';

export class CreateEventoDto {

  @IsString()
  nome_evento: string;
  @IsString()
  lideranca_responsavel?: string;

  @IsOptional()
  @IsString()
  inscricao?: string;

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
  imagensEvento?: string;

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
  @ValidateNested({ each: true })
  @Type(() => EventoFotosDto)
  fotos?: EventoFotosDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EventoVideosDto)
  videos?: EventoVideosDto[];
}
