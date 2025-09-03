import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventoFoto } from "./eventos.fotos.entity";
import { Repository } from "typeorm";
import { Evento } from "../eventos.entity";


@Injectable()
export class EventosFotosService{
    constructor(
        @InjectRepository(EventoFoto)
        private eventosFotosRepository: Repository<EventoFoto>,
        @InjectRepository(Evento)
        private eventosRepository: Repository<Evento>,
    ) {}

   async addFotosFromFiles(eventoId: string, files: Express.Multer.File[]): Promise<EventoFoto[]> {
    const evento = await this.eventosRepository.findOne({ where: { id: eventoId } });
    if (!evento) throw new Error(`Evento com id ${eventoId} não encontrado`);

    // Salva o caminho do arquivo (ou gere uma URL se for servir os arquivos)
    const novasFotos = files.map(file =>
        this.eventosFotosRepository.create({
            evento,
            url: file.path.replace(/\\/g, '/'), // ou gere uma URL pública se necessário
        })
    );
    return this.eventosFotosRepository.save(novasFotos);
}
    async findAll(): Promise<EventoFoto[]> {
        return this.eventosFotosRepository.find();
    }

    async findById(id: string): Promise<EventoFoto | null> {
        return this.eventosFotosRepository.findOne({ where: { id: id } });
    }

    async delete(id: string): Promise<string> {
        await this.eventosFotosRepository.delete(id);

        return "Deletado com sucesso";
    }

    async updateFotos(id: string, url: string): Promise<EventoFoto | null> {
        const foto = await this.findById(id);
        if (!foto) return null;

        foto.url = url;
        await this.eventosFotosRepository.save(foto);
        return foto;
    }
}