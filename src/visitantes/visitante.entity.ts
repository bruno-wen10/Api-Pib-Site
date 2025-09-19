import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Visitante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column('json', { nullable: true })
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };

  @Column()
  whatsapp: string;

  @Column({ default: false })
  frequentaIgreja: boolean;

  @Column({ nullable: true })
  qualIgreja?: string;

  @Column({ default: false })
  desejaEstudoBiblico: boolean;

  @Column({ default: false })
  desejaVisita: boolean;

  @Column({ default: false })
  aconselhamentoPastor: boolean;

  @Column({ default: false })
  desejaPedidoOracao: boolean;

  @Column({ default: false })
  receberProgramacao: boolean;

  @Column({ nullable: true })
  pedidoOracao?: string;
}
