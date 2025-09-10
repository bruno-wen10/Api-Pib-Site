import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventoFoto } from "./eventos.fotos.entity";
import { Repository } from "typeorm";
import { Evento } from "../eventos.entity";

@Injectable()
export class EventosFotosService {
  private readonly backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

  constructor(
    @InjectRepository(EventoFoto)
    private eventosFotosRepository: Repository<EventoFoto>,
    @InjectRepository(Evento)
    private eventosRepository: Repository<Evento>,
  ) {}

  async addFotosFromFiles(eventoId: string, files: Express.Multer.File[]): Promise<EventoFoto[]> {
    const evento = await this.eventosRepository.findOne({ where: { id: eventoId } });
    if (!evento) throw new Error(`Evento com id ${eventoId} não encontrado`);

    const novasFotos = files.map((file) =>
      this.eventosFotosRepository.create({
        evento,
        url: `${this.backendUrl}/uploads/fotos/uploads-fotos-evento/${file.filename}`,
      }),
    );

    return this.eventosFotosRepository.save(novasFotos);
  }

  async findAll(): Promise<EventoFoto[]> {
    return this.eventosFotosRepository.find({ relations: ["evento"] });
  }

  async findById(id: string): Promise<EventoFoto | null> {
    return this.eventosFotosRepository.findOne({ where: { id }, relations: ["evento"] });
  }

  async delete(id: string): Promise<string> {
    await this.eventosFotosRepository.delete(id);
    return "Deletado com sucesso";
  }

  async updateFotos(id: string, fileName: string): Promise<EventoFoto | null> {
    const foto = await this.findById(id);
    if (!foto) return null;

    foto.url = `${this.backendUrl}/uploads/fotos/uploads-fotos-evento/${fileName}`;
    await this.eventosFotosRepository.save(foto);
    return foto;
  }
}
