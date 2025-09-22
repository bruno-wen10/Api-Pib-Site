import { IsString, IsBoolean, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { EnderecoDto } from './endereco.dto';

export class CreateVisitanteDto {
  @IsString()
  nome: string;

  @IsString()
  celular: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @IsBoolean()
  frequentaIgreja: boolean;

  @IsOptional()
  @IsString()
  qualIgreja?: string;

  @IsBoolean()
  desejaVisita: boolean;
  @IsOptional()
  @IsString()
  voluntarioVisitaId?: string;

  @IsBoolean()
  aconselhamentoPastor: boolean;
  @IsOptional()
  @IsString()
  voluntarioAconselhamentoId?: string;

  @IsBoolean()
  receberProgramacao: boolean;
  @IsOptional()
  @IsString()
  voluntarioProgramacaoId?: string;

  @IsBoolean()
  desejaEstudoBiblico: boolean;
  @IsOptional()
  @IsString()
  voluntarioEstudoBiblicoId?: string;

  @IsBoolean()
  desejaOracao: boolean;
  @IsOptional()
  @IsString()
  pedidoOracao?: string;
  @IsOptional()
  @IsString()
  voluntarioOracaoId?: string;

  @IsOptional()
  @IsDateString()
  dataVisita?: string;
}
