import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { MinisterioFotos } from "./ministerio.foto.intity";
import { Ministerio } from "../ministerio.intity";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class MinisterioFotosService {
  constructor(
    @InjectRepository(MinisterioFotos)
    private ministerioFotosRepository: Repository<MinisterioFotos>,

    @InjectRepository(Ministerio)
    private ministerioRepository: Repository<Ministerio>,
  ) {}    

    async addFotosFromFiles(ministerioId: string, files: Express.Multer.File[]): Promise<MinisterioFotos[]> {
        const ministerio = await this.ministerioRepository.findOne({ where: { id: ministerioId } });
        if (!ministerio) throw new Error(`Ministério com id ${ministerioId} não encontrado`);

        // Salva o caminho do arquivo (ou gere uma URL se for servir os arquivos)
        const novasFotos = files.map(file =>
            this.ministerioFotosRepository.create({
                ministerio,
                url: file.path.replace(/\\/g, '/'), // ou gere uma URL pública se necessário
            })
        );
        return this.ministerioFotosRepository.save(novasFotos);
    }

    async findAll(): Promise<MinisterioFotos[]> {
            return this.ministerioFotosRepository.find({ relations: ['ministerio'] }); // pode se inserir relation para que as relações tão sejam listadas com a rota{ relations: ['evento'] }
        }

        async findById(id: string): Promise<MinisterioFotos | null> {
                return this.ministerioFotosRepository.findOne({ where: { id: id }, relations: ['ministerio'] });
            }
        
            async delete(id: string): Promise<string> {
                await this.ministerioFotosRepository.delete(id);

                return "Deletado com sucesso";
            }

            async updateFotos(id: string, url: string): Promise<MinisterioFotos | null> {
                const foto = await this.findById(id);
                if (!foto) return null;
        
                foto.url = url;
                await this.ministerioFotosRepository.save(foto);
                return foto;
            }
}