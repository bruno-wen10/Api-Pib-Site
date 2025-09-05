import { InjectRepository } from '@nestjs/typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMinisterioDto } from './dto-ministerio/create-ministerio-dto';
import { Ministerio } from './ministerio.intity';
import { find } from 'rxjs';

@Injectable()
export class MinisterioService {
  constructor(
    @InjectRepository(Ministerio)
    private ministerioRepository: Repository<Ministerio>,
  ) {}

  async CreateMinisterio(
  ministerio: CreateMinisterioDto,
  imagemBanner?: Express.Multer.File,
  logoMinisterio?: Express.Multer.File,
): Promise<Ministerio> {
  const novoMinisterio = this.ministerioRepository.create({
    ...ministerio,
    imagem_banner: imagemBanner ? imagemBanner.filename : undefined,
    logo_ministerio: logoMinisterio ? logoMinisterio.filename : undefined,
  });

  return this.ministerioRepository.save(novoMinisterio);
}

  async findAll(): Promise<Ministerio[]> {
    return this.ministerioRepository.find({ relations: ['fotos'] });
}

  async findById(id: string): Promise<Ministerio | null> {
    return this.ministerioRepository.findOne({ relations: ['fotos'] });
  }

  async update(
    id: string,
    ministerio: Partial<Ministerio>,
  ): Promise<Ministerio> {
    const ministerioAtualizado = await this.ministerioRepository.preload({
      id,
      ...ministerio,
    });

    if (!ministerioAtualizado) {
      throw new Error('Ministerio não encontrado');
    }

    return this.ministerioRepository.save(ministerioAtualizado);
  }

  async updateParcial(
    id: string,
    ministerio: Partial<Ministerio>,
  ): Promise<Ministerio> {
    const ministerioAtualizado = await this.ministerioRepository.preload({
      id,
      ...ministerio,
    });

    if (!ministerioAtualizado) {
      throw new Error('Ministerio não encontrado');
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
