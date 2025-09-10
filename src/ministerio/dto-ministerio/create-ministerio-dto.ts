import { IsOptional, IsString, ValidateNested } from "class-validator";
import { MinisterioFotosDto } from "../ministerio-fotos/dto-ministerio-fotos/ministerio-fotos-dto";
import { Type } from "class-transformer";




export class CreateMinisterioDto {
    @IsString()
    nome_ministerio: string;

    @IsOptional()
    @IsString()
    slug?: string;  

    @IsOptional()
    @IsString()
    funcoes_ministerio?: string;


    @IsOptional()
    @IsString()
    descricao_ministerio?: string;

    @IsOptional()
    @IsString()
    sobre_ministerio?: string;

    @IsOptional()
    @IsString()
    imagem_banner?: string;

    @IsOptional()
    @IsString()
    logo_ministerio?: string;

    @IsOptional()
    @IsString()
    lideranca_responsavel?: string;

    @IsOptional()
    @IsString()
    contato_email?: string;

    @IsOptional()
    @IsString()
    contato_telefone?: string;



    @IsOptional()
    @IsString()
    encontros?: string;

    @IsOptional()
    @IsString()
    redes_sociais?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MinisterioFotosDto)
    fotos?: MinisterioFotosDto[];

    

}
