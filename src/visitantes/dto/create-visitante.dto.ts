import { IsString, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EnderecoDto {
  @IsOptional()
  @IsString()
  rua?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}

export class CreateVisitanteDto {
  @IsString()
  nome: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;

  @IsString()
  whatsapp: string;

  @IsBoolean()
  frequentaIgreja: boolean;

  @IsOptional()
  @IsString()
  qualIgreja?: string;

  @IsBoolean()
  desejaEstudoBiblico: boolean;

  @IsBoolean()
  desejaVisita: boolean;

  @IsBoolean()
  aconselhamentoPastor: boolean;

  @IsBoolean()
  desejaPedidoOracao: boolean;

  @IsBoolean()
  receberProgramacao: boolean;

  @IsOptional()
  @IsString()
  pedidoOracao?: string;
}
