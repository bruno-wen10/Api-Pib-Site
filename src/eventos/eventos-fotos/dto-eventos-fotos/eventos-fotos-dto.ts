import { IsNumber, IsString } from "class-validator";


export class EventoFotosDto {   
    
   @IsString()
   url: string;

}