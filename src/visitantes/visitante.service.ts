import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitante } from './visitante.entity';
import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { UpdateVisitanteDto } from './dto/update-visitante.dto';

@Injectable()
export class VisitanteService {
  constructor(
    @InjectRepository(Visitante)
    private visitanteRepository: Repository<Visitante>,
  ) {}

  async create(dto: CreateVisitanteDto): Promise<Visitante> {
    const visitante = this.visitanteRepository.create(dto);
    return this.visitanteRepository.save(visitante);
  }

  async findAll(): Promise<Visitante[]> {
    return this.visitanteRepository.find();
  }

  async findOne(id: string): Promise<Visitante | null> {
    return this.visitanteRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateVisitanteDto): Promise<Visitante> {
    await this.visitanteRepository.update(id, dto);
    const visitante = await this.findOne(id);
    if (!visitante) {
      throw new Error('Visitante not found');
    }
    return visitante;
  }

  async remove(id: string): Promise<void> {
    await this.visitanteRepository.delete(id);
  }
}
