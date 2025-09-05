import { IsOptional, IsString } from "class-validator";




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
    descricao_atividade?: string;

    @IsOptional()
    @IsString()
    descricao_curta?: string;

    @IsOptional()
    @IsString()
    descricao_completa?: string;

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
    redes_sociais?: string;

    

}
