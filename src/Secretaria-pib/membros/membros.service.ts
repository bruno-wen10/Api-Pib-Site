import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membro } from './membro.entity';
import { CreateMembroDto } from './dto/create-membro.dto';
import { UpdateMembroDto } from './dto/update-membro.dto';
import { FilterMembroDto } from './dto/filter-membro.dto';

@Injectable()
export class MembrosService {
  constructor(
    @InjectRepository(Membro)
    private readonly membroRepository: Repository<Membro>,
  ) {}

  create(dto: CreateMembroDto): Promise<Membro> {
    const membro = this.membroRepository.create({
      ...dto,
      endereco: dto.endereco,
    });
    return this.membroRepository.save(membro);
  }

  findAll(): Promise<Membro[]> {
    return this.membroRepository.find();
  }

  async findOne(id: string): Promise<Membro> {
    const membro = await this.membroRepository.findOneBy({ id });
    if (!membro) {
      throw new Error(`Membro with id ${id} not found`);
    }
    return membro;
  }

  async update(id: string, dto: UpdateMembroDto): Promise<Membro> {
    await this.membroRepository.update(id, {
      ...dto,
      endereco: dto.endereco,
      dateUpdate: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.membroRepository.delete(id);
  }

  async filter(filter: FilterMembroDto): Promise<Membro[]> {
    const query = this.membroRepository.createQueryBuilder('membro');
    if (filter.nome) query.andWhere('membro.nome ILIKE :nome', { nome: `%${filter.nome}%` });
    if (filter.email) query.andWhere('membro.email ILIKE :email', { email: `%${filter.email}%` });
    if (filter.modalidadeEntrada) query.andWhere('membro.modalidadeEntrada = :modalidadeEntrada', { modalidadeEntrada: filter.modalidadeEntrada });
    if (filter.motivoSaida) query.andWhere('membro.motivoSaida = :motivoSaida', { motivoSaida: filter.motivoSaida });
    if (filter.vezesMembro) query.andWhere('membro.vezesMembro = :vezesMembro', { vezesMembro: filter.vezesMembro });

    // Filtro por membro ativo/inativo
    if (typeof filter.membroAtivo === 'boolean') {
      query.andWhere('membro.membroAtivo = :membroAtivo', { membroAtivo: filter.membroAtivo });
    }

    // Filtros por datas
    if (filter.dataEntradaStart)
      query.andWhere('membro.dataEntrada >= :dataEntradaStart', { dataEntradaStart: filter.dataEntradaStart });
    if (filter.dataEntradaEnd)
      query.andWhere('membro.dataEntrada <= :dataEntradaEnd', { dataEntradaEnd: filter.dataEntradaEnd });
    if (filter.dataNascimentoStart)
      query.andWhere('membro.dataNascimento >= :dataNascimentoStart', { dataNascimentoStart: filter.dataNascimentoStart });
    if (filter.dataNascimentoEnd)
      query.andWhere('membro.dataNascimento <= :dataNascimentoEnd', { dataNascimentoEnd: filter.dataNascimentoEnd });

    // Filtros por endereço embutido
    if (filter.endereco) {
      if (filter.endereco.rua)
        query.andWhere('membro.enderecoRua ILIKE :rua', { rua: `%${filter.endereco.rua}%` });
      if (filter.endereco.bairro)
        query.andWhere('membro.enderecoBairro ILIKE :bairro', { bairro: `%${filter.endereco.bairro}%` });
      if (filter.endereco.cep)
        query.andWhere('membro.enderecoCep = :cep', { cep: filter.endereco.cep });
      if (filter.endereco.createdAtStart)
        query.andWhere('membro.enderecoCreatedAt >= :createdAtStart', { createdAtStart: filter.endereco.createdAtStart });
      if (filter.endereco.createdAtEnd)
        query.andWhere('membro.enderecoCreatedAt <= :createdAtEnd', { createdAtEnd: filter.endereco.createdAtEnd });
      if (filter.endereco.updatedAtStart)
        query.andWhere('membro.enderecoUpdatedAt >= :updatedAtStart', { updatedAtStart: filter.endereco.updatedAtStart });
      if (filter.endereco.updatedAtEnd)
        query.andWhere('membro.enderecoUpdatedAt <= :updatedAtEnd', { updatedAtEnd: filter.endereco.updatedAtEnd });
    }
    return query.getMany();
  }
}
