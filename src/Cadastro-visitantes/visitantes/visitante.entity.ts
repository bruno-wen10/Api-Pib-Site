import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Voluntario } from '../voluntarios/voluntario.entity';

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
  celular: string;

  @Column({ default: false })
  frequentaIgreja: boolean;

  @Column({ nullable: true })
  qualIgreja?: string;

  @Column({ default: false })
  desejaVisita: boolean;
  @ManyToOne(() => Voluntario, { nullable: true })
  @JoinColumn({ name: 'voluntarioVisitaId' })
  voluntarioVisita?: Voluntario;

  @Column({ default: false })
  aconselhamentoPastor: boolean;
  @ManyToOne(() => Voluntario, { nullable: true })
  @JoinColumn({ name: 'voluntarioAconselhamentoId' })
  voluntarioAconselhamento?: Voluntario;

  @Column({ default: false })
  receberProgramacao: boolean;
  @ManyToOne(() => Voluntario, { nullable: true })
  @JoinColumn({ name: 'voluntarioProgramacaoId' })
  voluntarioProgramacao?: Voluntario;

  @Column({ default: false })
  desejaEstudoBiblico: boolean;
  @ManyToOne(() => Voluntario, { nullable: true })
  @JoinColumn({ name: 'voluntarioEstudoBiblicoId' })
  voluntarioEstudoBiblico?: Voluntario;

  @Column({ default: false })
  desejaOracao: boolean;
  @Column({ nullable: true })
  pedidoOracao?: string;
  @ManyToOne(() => Voluntario, { nullable: true })
  @JoinColumn({ name: 'voluntarioOracaoId' })
  voluntarioOracao?: Voluntario;

  @Column({ type: 'date', nullable: true })
  dataVisita?: string;
}
