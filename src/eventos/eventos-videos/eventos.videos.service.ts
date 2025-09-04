import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Evento } from "../eventos.entity";
import { EventoVideo } from "./eventos-videos.entity";

@Injectable()
export class EventosVideosService {
    constructor(
        @InjectRepository(EventoVideo)
        private eventosVideosRepository: Repository<EventoVideo>,
        @InjectRepository(Evento)
        private eventosRepository: Repository<Evento>,
    ) {}

    async addVideos(eventoId: string, files: Express.Multer.File[]): Promise<EventoVideo[]> {

        const evento = await this.eventosRepository.findOne({ where: { id: eventoId } });
        if (!evento) throw new Error(`Evento com id ${eventoId} não encontrado`);

        const novosVideos = files.map(file =>
            this.eventosVideosRepository.create({
                evento,
                url: file.path.replace(/\\/g, '/'), // ou gere uma URL pública se necessário
            })
        )

        return this.eventosVideosRepository.save(novosVideos);
    }

   

    async findAll(): Promise<EventoVideo[]> {
        return this.eventosVideosRepository.find({ relations: ['evento'] }); // pode se inserir relation para que as relações tão sejam listadas com a rota{ relations: ['evento'] }
    }

    async findById(id: string): Promise<EventoVideo | null> {
        return this.eventosVideosRepository.findOne({ where: { id }, relations: ['evento'] });
    }

    async delete(id: string): Promise<string> {
        await this.eventosVideosRepository.delete(id);
        return "Deletado com sucesso";
    }

    async updateVideo(id: string, url: string): Promise<EventoVideo | null> {
        const video = await this.findById(id);
        if (!video) return null;

        video.url = url;
        await this.eventosVideosRepository.save(video);
        return video;
    }
}
