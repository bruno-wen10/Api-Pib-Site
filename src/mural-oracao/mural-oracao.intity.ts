import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('mural_oracao')
export class MuralOracao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    nome?: string;

    @Column({ type: 'text'})
    pedido_oracao?: string;
}