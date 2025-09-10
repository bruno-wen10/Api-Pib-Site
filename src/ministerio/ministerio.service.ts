import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMinisterioDto } from './dto-ministerio/create-ministerio-dto';
import { Ministerio } from './ministerio.intity';

@Injectable()
export class MinisterioService {
   private readonly backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

  constructor(
    @InjectRepository(Ministerio)
    private ministerioRepository: Repository<Ministerio>,
  ) {}

  async CreateMinisterio(
  ministerioDto: CreateMinisterioDto,
  imagemBanner?: Express.Multer.File,
  logoMinisterio?: Express.Multer.File,
): Promise<Ministerio> {

  const { fotos, ...ministerioData } = ministerioDto;

  const novoMinisterio = this.ministerioRepository.create({
    ...ministerioData,
    imagem_banner: ministerioData.imagem_banner
      ? `${this.backendUrl}${ministerioData.imagem_banner.replace(/\\/g, "/")}`
      : undefined,

    logo_ministerio: ministerioData.logo_ministerio
      ? `${this.backendUrl}${ministerioData.logo_ministerio.replace(/\\/g, "/")}`
      : undefined,
      
    fotos: fotos?.map((foto) => ({ url: `${this.backendUrl}${foto.url}` })),
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
