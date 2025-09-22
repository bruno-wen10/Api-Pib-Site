import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voluntario } from './voluntario.entity';
import { CreateVoluntarioDto } from './dto/create-voluntario.dto';
import { UpdateVoluntarioDto } from './dto/update-voluntario.dto';

@Injectable()
export class VoluntarioService {
  constructor(
    @InjectRepository(Voluntario)
    private voluntarioRepository: Repository<Voluntario>,
  ) {}

  async create(dto: CreateVoluntarioDto): Promise<Voluntario> {
    const voluntario = this.voluntarioRepository.create(dto);
    return this.voluntarioRepository.save(voluntario);
  }

  async findAll(): Promise<Voluntario[]> {
    return this.voluntarioRepository.find();
  }

  async findOne(id: string): Promise<Voluntario | null> {
    return this.voluntarioRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateVoluntarioDto): Promise<Voluntario> {
    await this.voluntarioRepository.update(id, dto);
    const voluntario = await this.findOne(id);
    if (!voluntario) {
      throw new Error('Voluntário não encontrado');
    }
    return voluntario;
  }

  async remove(id: string): Promise<void> {
    await this.voluntarioRepository.delete(id);
  }
}
