import { IsBoolean, IsDate, IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  perfil: string;

  @IsBoolean()
  userAdmin: boolean;

  @IsString()
  telefone: string;

 @IsString()
dateNascimento: string;

  @IsBoolean()
  politicasLGPD: boolean;
}

