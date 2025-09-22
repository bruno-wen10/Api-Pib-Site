import { IsString, IsArray } from 'class-validator';

export class CreateVoluntarioDto {
  @IsString()
  nome: string;

  @IsString()
  celular: string;

  @IsArray()
  funcoes: string[];
}
