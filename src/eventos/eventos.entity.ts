import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EventoFoto } from "./eventos-fotos/eventos.fotos.entity";
import { EventoVideo } from "./eventos-videos/eventos-videos.entity";


@Entity('eventos')
export class Evento {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ length: 100 })
   nome_evento: string;

   @Column({length: 100})
   lideranca_responsavel: string;

   @Column({ length: 255, nullable: true })
   inscricao: string;


   @Column({ length: 50, nullable: true })
  data_inicio_inscricao: string;

  @Column({ length: 50, nullable: true })
  data_fim_inscricao: string;

  @Column({ length: 100 })
  local: string;

  @Column("text", { nullable: true })
  descricao: string;

  @Column('text', { nullable: true })
  descricao_evento: string;

  @Column("text", { nullable: true })
  sobre_evento: string;

  @Column({ length: 255, nullable: true })
  imagemEvento: string;

 @Column({ default: false, nullable: true })
destaque: boolean;

  @Column({ type: "date", nullable: true })
  dataInicio_evento: Date;

  @Column({ type: "date", nullable: true })
  dataFim_evento: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
      
   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

  // Relações
  @OneToMany(() => EventoFoto, (foto) => foto.evento, { cascade: true })
  fotos: EventoFoto[];

  @OneToMany(() => EventoVideo, (video) => video.evento, { cascade: true })
  videos: EventoVideo[];
}
