import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMinisterioDto } from './dto-ministerio/create-ministerio-dto';
import { Ministerio } from './ministerio.intity';

@Injectable()
export class MinisterioService {
  updateParcial(id: string, ministerio: Partial<Ministerio>) {
    throw new Error("Method not implemented.");
  }
  constructor(
    @InjectRepository(Ministerio)
    private ministerioRepository: Repository<Ministerio>,
  ) {}

  async CreateMinisterio(
    ministerioDto: CreateMinisterioDto,
    imagemBanner?: Express.Multer.File,
    logoMinisterio?: Express.Multer.File,
  ): Promise<Ministerio> {
    // Se imagens foram enviadas via FormData → sobrescreve
    if (imagemBanner) {
      ministerioDto.imagem_banner = imagemBanner.filename;
    }
    if (logoMinisterio) {
      ministerioDto.logo_ministerio = logoMinisterio.filename;
    }

    const novoMinisterio = this.ministerioRepository.create({
      ...ministerioDto,
    });

    return this.ministerioRepository.save(novoMinisterio);
  }

  async findAll(): Promise<Ministerio[]> {
    return this.ministerioRepository.find({ relations: ['fotos'] });
  }

  async findById(id: string): Promise<Ministerio | null> {
    return this.ministerioRepository.findOne({ where: { id }, relations: ['fotos'] });
  }



 async update(id: string, ministerio: Partial<Ministerio>): Promise<Ministerio> {
    const ministerioAtualizado = await this.ministerioRepository.preload({
      id,
      ...ministerio,
    });

    if (!ministerioAtualizado) {
      throw new NotFoundException('Ministerio não encontrado');
    }

    return this.ministerioRepository.save(ministerioAtualizado);
  }


  async delete(id: string): Promise<{ message: string }> {
    const ministerio = await this.ministerioRepository.findOneBy({ id });

    if (!ministerio) {
      throw new Error('Ministerio não encontrado');
    }

    await this.ministerioRepository.remove(ministerio);
    return { message: 'Ministerio deletado com sucesso' };
  }
}
