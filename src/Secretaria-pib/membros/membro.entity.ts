import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Endereco } from './endereco.entity';

@Entity('membros')
export class Membro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column(type => Endereco)
  endereco: Endereco;

 @Column({ type: 'date' })
dataNascimento: Date;

@Column({ type: 'date' })
dataEntrada: Date; 

  @Column()
  modalidadeEntrada: string;

  @Column()
  igrejaBatismo: string;

  @Column()
  numeroAtaEntrada: string;

  @Column()
  vezesMembro: number;

  @Column()
  motivoUltimaSaida: string;

  @Column({ nullable: true })
  numeroAtaSaida: string;

  @Column({ nullable: true })
  observacoes: string;

  @Column({ default: true })
  membroAtivo: boolean;

  @CreateDateColumn()
  dateCreate: Date;

  @UpdateDateColumn()
  dateUpdate: Date;
}
