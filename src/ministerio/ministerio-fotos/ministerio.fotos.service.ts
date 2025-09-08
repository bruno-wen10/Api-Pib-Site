import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { MinisterioFotos } from "./ministerio.foto.intity";
import { Ministerio } from "../ministerio.intity";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs/promises';
import { join } from "path";

@Injectable()
export class MinisterioFotosService {
  private readonly logger = new Logger(MinisterioFotosService.name);

  constructor(
    @InjectRepository(MinisterioFotos)
    private ministerioFotosRepository: Repository<MinisterioFotos>,

    @InjectRepository(Ministerio)
    private ministerioRepository: Repository<Ministerio>,
  ) {}    

  async addFotosFromFiles(ministerioId: string, files: Express.Multer.File[]): Promise<MinisterioFotos[]> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ministerioId)) {
      throw new BadRequestException('ministerioId deve ser um UUID válido');
    }

    const ministerio = await this.ministerioRepository.findOne({ where: { id: ministerioId } });
    if (!ministerio) {
      throw new NotFoundException(`Ministério com id ${ministerioId} não encontrado`);
    }

    const novasFotos = files.map(file =>
      this.ministerioFotosRepository.create({
        ministerio,
        url: file.path, // Mantém o caminho completo gerado pelo multer
      })
    );
    return this.ministerioFotosRepository.save(novasFotos);
  }

  async findAll(): Promise<MinisterioFotos[]> {
    return this.ministerioFotosRepository.find({ relations: ['ministerio'] });
  }

  async findById(id: string): Promise<MinisterioFotos | null> {
    return this.ministerioFotosRepository.findOne({ where: { id: id }, relations: ['ministerio'] });
  }

  async delete(id: string): Promise<string> {
    const foto = await this.ministerioFotosRepository.findOne({
      where: { id }
    });

    if (!foto) {
      throw new NotFoundException('Foto não encontrada');
    }

    // DEBUG: Log para verificar o caminho salvo
    this.logger.debug(`Tentando deletar arquivo: ${foto.url}`);

    try {
      // Tenta deletar o arquivo físico usando o caminho absoluto salvo
      await fs.unlink(foto.url);
      this.logger.log(`Arquivo deletado com sucesso: ${foto.url}`);
    } catch (error) {
      // Se não encontrar pelo caminho absoluto, tenta pelo caminho relativo
      try {
        const relativePath = foto.url.replace(process.cwd(), '').replace(/^[\\/]/, '');
        await fs.unlink(join(process.cwd(), relativePath));
        this.logger.log(`Arquivo deletado com sucesso (caminho relativo): ${relativePath}`);
      } catch (secondError) {
        this.logger.warn(`Não foi possível deletar o arquivo físico: ${foto.url}`, error.message);
        this.logger.warn(`Também não foi possível pelo caminho relativo: ${secondError.message}`);
        // Continua com a deleção do registro mesmo se o arquivo não existir
      }
    }

    // Deleta o registro do banco de dados
    await this.ministerioFotosRepository.delete(id);
    return "Deletado com sucesso";
  }

  async updateFotos(id: string, url: string): Promise<MinisterioFotos | null> {
    const foto = await this.findById(id);
    if (!foto) return null;

    // Salva o caminho antigo antes de atualizar
    const oldFilePath = foto.url;

    // Atualiza a URL primeiro
    foto.url = url;
    const updatedFoto = await this.ministerioFotosRepository.save(foto);

    // Depois tenta deletar o arquivo antigo
    try {
      await fs.unlink(oldFilePath);
      this.logger.log(`Arquivo antigo deletado com sucesso: ${oldFilePath}`);
    } catch (error) {
      this.logger.warn(`Não foi possível deletar o arquivo antigo: ${oldFilePath}`, error.message);
    }

    return updatedFoto;
  }
}