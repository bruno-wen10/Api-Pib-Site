import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  membro: boolean;

  @IsString()
  telefone: string;

  @IsString()
  dateNascimento: string;

  @IsBoolean()
  politicasLGPD: boolean;

  @IsOptional()
  permissions?: Record<string, boolean>;
}
