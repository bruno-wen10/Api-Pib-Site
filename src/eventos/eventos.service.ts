import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Evento } from "./eventos.entity";
import { Repository } from "typeorm";
import { CreateEventoDto } from "./dto/create-evento-dto";




@Injectable()
export class EventosService {
    constructor(
        @InjectRepository(Evento)
        private eventosRepository: Repository<Evento>,
    ) {}

    createEvento(evento: CreateEventoDto): Promise<Evento> {
        // const novoEvento = this.eventosRepository.create(evento);
        // return this.eventosRepository.save(novoEvento);

        //CONTINUAR DAQUI... 
    }
}

