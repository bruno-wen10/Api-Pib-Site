import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('mural_oracao')
export class MuralOracao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    nome?: string;

    @Column({ type: 'text'})
    pedido_oracao?: string;

     @Column({ type: 'int', default: 0 })
     interacoes: number;

     @CreateDateColumn({ name: 'data_criacao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
     data_criacao: Date;
     
}