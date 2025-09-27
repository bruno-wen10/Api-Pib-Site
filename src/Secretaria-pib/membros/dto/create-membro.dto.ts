import { IsString, IsEmail, IsOptional, IsDateString, IsInt, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EnderecoDto {
  @IsString()
  rua?: string;

  @IsString()
  numero?: string;

  @IsString()
  bairro?: string;

  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  complemento?: string;
}

export class CreateMembroDto {
  @IsString()
  nome: string;

  @IsEmail()
  email?: string;

  @IsString()
  telefone?: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;

  @IsDateString()
  dataNascimento?: Date;

  @IsDateString()
  dataEntrada?: Date;

  @IsOptional()
  @IsString()
  modalidadeEntrada?: string;

  @IsString()
  igrejaBatismo?: string;

  @IsString()
  numeroAtaEntrada?: string;

  @IsInt()
  vezesMembro?: number;

  @IsOptional()
  @IsString()
  motivoUltimaSaida?: string;

  @IsOptional()
  @IsString()
  numeroAtaSaida?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  membroAtivo?: boolean;

  @IsOptional()
  @IsDateString()
  dateCreate?: Date;

  @IsOptional()
  @IsDateString()
  dateUpdate?: Date;
}
