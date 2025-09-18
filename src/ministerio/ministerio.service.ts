import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMinisterioDto } from './dto-ministerio/create-ministerio-dto';
import { Ministerio } from './ministerio.intity';

@Injectable()
export class MinisterioService {
  constructor(
    @InjectRepository(Ministerio)
    private ministerioRepository: Repository<Ministerio>,
  ) {}

  /**
   * MÉTODO CREATE CORRIGIDO
   * Agora ele é muito mais simples. Ele recebe o DTO do controller,
   * que já contém as URLs completas para o banner e o logo.
   * Ele não precisa mais saber sobre arquivos.
   */
  async CreateMinisterio(ministerioDto: CreateMinisterioDto): Promise<Ministerio> {
    const novoMinisterio = this.ministerioRepository.create(ministerioDto);
    return this.ministerioRepository.save(novoMinisterio);
  }

  /**
   * MÉTODO UPDATE CORRIGIDO
   * Também foi simplificado. O controller prepara o DTO parcial com as
   * novas URLs, e o service apenas aplica a atualização.
   */
  async update(id: string, updateDto: Partial<CreateMinisterioDto>): Promise<Ministerio> {
    const ministerio = await this.ministerioRepository.preload({
      id,
      ...updateDto,
    });

    if (!ministerio) {
      throw new NotFoundException(`Ministério com ID ${id} não encontrado`);
    }

    return this.ministerioRepository.save(ministerio);
  }

  async findAll(): Promise<Ministerio[]> {
    return this.ministerioRepository.find({ relations: ['fotos'] });
  }

  async findById(id: string): Promise<Ministerio | null> {
    const ministerio = await this.ministerioRepository.findOne({ where: { id }, relations: ['fotos'] });
    if (!ministerio) {
      throw new NotFoundException(`Ministério com ID ${id} não encontrado`);
    }
    return ministerio;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.ministerioRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ministério com ID ${id} não encontrado`);
    }
    
    return { message: 'Ministério deletado com sucesso' };
  }
}