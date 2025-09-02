import { IsNumber, IsString } from "class-validator";



export class EventoVideosDto {
    @IsNumber()
    id: number;

    @IsNumber()
    eventoId: number;

    @IsString()
    url: string;
}