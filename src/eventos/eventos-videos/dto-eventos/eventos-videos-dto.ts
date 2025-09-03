import { IsNumber, IsString } from "class-validator";



export class EventoVideosDto {

    @IsString()
    url: string;
}