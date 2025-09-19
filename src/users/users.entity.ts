import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  membro: boolean;

  @Column()
  telefone: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  dateNascimento: string;

  @Column({ default: false }) // É melhor ter um default
  politicasLGPD: boolean;

  // JSON com permissões por rota
  @Column('json', { default: {} })
  permissions: Record<string, boolean>;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
