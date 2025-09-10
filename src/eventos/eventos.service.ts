import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Evento } from "./eventos.entity";
import { IsNull, Repository } from "typeorm";
import { CreateEventoDto } from "./dto-eventos/create-evento-dto";

@Injectable()
export class EventosService {
  private readonly backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

  constructor(
    @InjectRepository(Evento)
    private eventosRepository: Repository<Evento>,
  ) {}

  createEvento(evento: CreateEventoDto): Promise<Evento> {
    const { fotos, videos, ...eventoData } = evento;

    const novoEvento = this.eventosRepository.create({
      ...eventoData,
      imagemEvento: eventoData.imagemEvento
        ? `${this.backendUrl}${eventoData.imagemEvento.replace(/\\/g, "/")}`
        : undefined,
        
      fotos: fotos?.map((foto) => ({ url: `${this.backendUrl}${foto.url}` })),
      videos: videos?.map((video) => ({ url: video.url })),
    });

    return this.eventosRepository.save(novoEvento);
  }

  async findAll(): Promise<Evento[]> {
    return this.eventosRepository.find({
      where: { deletedAt: IsNull() },
      relations: ["fotos", "videos"],
    });
  }

  async findById(id: string): Promise<Evento | null> {
    return this.eventosRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["fotos", "videos"],
    });
  }

  async update(id: string, evento: Partial<Evento>): Promise<Evento> {
    if (!id) throw new Error("ID inválido");

    const eventoAtualizado = await this.eventosRepository.preload({
      id,
      ...evento,
    });

    if (!eventoAtualizado) {
      throw new Error("Evento não encontrado");
    }

    return this.eventosRepository.save(eventoAtualizado);
  }

  async Delete(id: string): Promise<string> {
    const evento = await this.findById(id);
    if (!evento) throw new Error("Evento não encontrado");

    await this.eventosRepository.remove(evento);
    return "Evento excluído com sucesso";
  }

  async restore(id: string): Promise<string> {
    const evento = await this.eventosRepository.restore(id);
    if (!evento) throw new Error("Evento não encontrado");

    return "Evento restaurado com sucesso";
  }

  async findEventDestaque(): Promise<Evento[]> {
    return this.eventosRepository.find({
      where: { destaque: true },
      relations: ["fotos", "videos"],
    });
  }
}
