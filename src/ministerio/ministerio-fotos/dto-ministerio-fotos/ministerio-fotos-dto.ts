import { Ministerio } from './../../ministerio.intity';
import { IsNumber, IsString } from "class-validator";


export class MinisterioFotosDto {   
    
   @IsString()
   url: string;

}