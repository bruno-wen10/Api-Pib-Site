import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuralOracao } from './mural-oracao.intity';
import { CreateMuralOracaoDto } from './dto-mural-oracao/mural-oracao-dto';
import { UpdateMuralOracaoDto } from './dto-mural-oracao/mural-oracao-update-dto';


@Injectable()
export class MuralOracaoService {
  constructor(
    @InjectRepository(MuralOracao)
    private muralOracaoRepository: Repository<MuralOracao>,
  ) {}

  // Criar um novo pedido de oração
  async create(createMuralOracaoDto: CreateMuralOracaoDto): Promise<MuralOracao> {
    const muralOracao = this.muralOracaoRepository.create(createMuralOracaoDto);
    return this.muralOracaoRepository.save(muralOracao);
  }

  // Listar todos
  async findAll(): Promise<MuralOracao[]> {
    return this.muralOracaoRepository.find();
  }

  // Buscar por id
  async findOneById(id: string): Promise<MuralOracao> {
    const muralOracao = await this.muralOracaoRepository.findOne({ where: { id } });
    if (!muralOracao) {
      throw new NotFoundException(`Pedido de oração com id ${id} não encontrado`);
    }
    return muralOracao;
  }

  // Atualizar
  async update(id: string, updateMuralOracaoDto: UpdateMuralOracaoDto): Promise<MuralOracao> {
    const muralOracao = await this.findOneById(id);
    Object.assign(muralOracao, updateMuralOracaoDto);
    return this.muralOracaoRepository.save(muralOracao);
  }

  // Remover
  async remove(id: string): Promise<void> {
    const result = await this.muralOracaoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pedido de oração com id ${id} não encontrado`);
    }
  }
}
