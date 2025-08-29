import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Evento } from "./eventos.entity";

@Entity("eventos_videos")
export class EventoVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Evento, (evento) => evento.videos, { onDelete: "CASCADE" })
  evento: Evento;
}
