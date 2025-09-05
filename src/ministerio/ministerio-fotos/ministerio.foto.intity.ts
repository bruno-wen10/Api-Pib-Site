import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ministerio } from "../ministerio.intity";


@Entity('ministerio_fotos')
export class MinisterioFotos{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ length: 255 })
    url: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Ministerio, (ministerio) => ministerio.fotos, { onDelete: "CASCADE", cascade: ['insert', 'update',] })
    ministerio: Ministerio;
}