import { IsNumber, IsString } from "class-validator";


export class EventoFotosDto {
    @IsNumber()
    id: number;

    @IsNumber()
    eventoId: number;
    
   @IsString()
   url: string;

}