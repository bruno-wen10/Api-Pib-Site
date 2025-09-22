import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Voluntario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  celular: string;

  @Column('simple-array')
  funcoes: string[]; // Ex: ['visita', 'aconselhamento', 'programacao', 'estudoBiblico', 'oracao', 'Pequeno Grupo']
}
