import { Column } from 'typeorm';

export class Endereco {
  @Column()
  rua: string;

  @Column()
  numero: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @Column({ nullable: true })
  estado?: string;

  @Column({ nullable: true })
  cidade?: string; 

  @Column({ nullable: true })
  complemento: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
