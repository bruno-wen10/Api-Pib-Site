import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsDate, 
  ValidateNested, 
  isString
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
  data_inicio_inscricao?: string;

  @IsOptional()
  @IsString()
  data_fim_inscricao?: string;

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
  imagemEvento?: string;

  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @IsOptional()
  @IsString()
  dataInicio_evento?: string;

  @IsOptional()
  @IsString()
  dataFim_evento?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EventoFotosDto)
  fotos?: EventoFotosDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EventoVideosDto)
  videos?: EventoVideosDto[];
}
