import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { Evento } from "../eventos.entity";

@Entity("eventos_fotos")
export class EventoFoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;     

  @ManyToOne(() => Evento, (evento) => evento.fotos, { onDelete: "CASCADE", cascade: ['insert', 'update',] })
  evento: Evento;
}
