import { IsOptional, IsString, IsInt, IsIn } from 'class-validator';
import { EnderecoFilterDto } from './endereco-filter.dto';

export class FilterMembroDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  modalidadeEntrada?: string;

  @IsOptional()
  @IsString()
  motivoSaida?: string;

  @IsOptional()
  @IsInt()
  vezesMembro?: number;

  @IsOptional()
  endereco?: EnderecoFilterDto;

  @IsOptional()
  dataEntradaStart?: string;

  @IsOptional()
  dataEntradaEnd?: string;

  @IsOptional()
  dataNascimentoStart?: string;

  @IsOptional()
  dataNascimentoEnd?: string;

  @IsOptional()
  membroAtivo?: boolean;
}
