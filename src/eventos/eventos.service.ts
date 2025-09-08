import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Evento } from "./eventos.entity";
import { IsNull, Repository } from "typeorm";
import { CreateEventoDto } from "./dto-eventos/create-evento-dto";




@Injectable()
export class EventosService {
    
    constructor(
        @InjectRepository(Evento)
        private eventosRepository: Repository<Evento>,
    ) {}

    createEvento(evento: CreateEventoDto): Promise<Evento> {


        const {fotos, videos, ...eventoData} = evento;

        const novoEvento = this.eventosRepository.create({
            ...eventoData,
            imagemEvento: eventoData.imagemEvento?.replace(/\\/g, '/'),
            fotos: fotos?.map(foto => ({ url: foto.url })) ,
            videos: videos?.map(video => ({ url: video.url })) ,
        });
         return this.eventosRepository.save(novoEvento);        
    }

    async findAll (): Promise<Evento[]> {
        const eventos = await this.eventosRepository.find({ where: { deletedAt: IsNull() }, relations: ['fotos', 'videos'] });
        return eventos;
    }

    async findById(id: string): Promise<Evento | null> {
        const evento = await this.eventosRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['fotos', 'videos']
        });
        return evento;
    }  

    async update(id: string, evento: Partial<Evento>): Promise<Evento> {
    const eventoAtualizado = await this.eventosRepository.preload({
        id,
        ...evento
    });
    if (!eventoAtualizado) {
        throw new Error('Evento não encontrado');
    }
    return this.eventosRepository.save(eventoAtualizado);   
}

    async updatePartial(id: string, evento: Partial<Evento>): Promise<Evento> {
        const eventoAtualizado = await this.eventosRepository.preload({
            id,
            ...evento
        });
        if (!eventoAtualizado) {
            throw new Error('Evento não encontrado');
        }
        return this.eventosRepository.save(eventoAtualizado);
    }

  
      async Delete(id: string): Promise<string> {
        const evento = await this.findById(id);
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        await this.eventosRepository.remove(evento);
        return 'Evento excluído com sucesso';
    }

    async restore(id: string): Promise<string>{
        const evento = await this.eventosRepository.restore(id);
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        return 'Evento restaurado com sucesso';
    }
    async findEventDestaque(): Promise<Evento[]> {
        const eventos = await this.eventosRepository.find({
            where: { destaque: true },
            relations: ['fotos', 'videos']
        });
        return eventos;
    }

    



}
