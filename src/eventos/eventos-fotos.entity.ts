import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Evento } from "./eventos.entity";

@Entity("eventos_fotos")
export class EventoFoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Evento, (evento) => evento.fotos, { onDelete: "CASCADE" })
  evento: Evento;
}
