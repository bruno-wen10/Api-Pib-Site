import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MinisterioFotos } from "./ministerio-fotos/ministerio.foto.intity";





@Entity('ministerios')
export class Ministerio {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ length: 100 })
    nome_ministerio?: string;

    @Column({ length: 100, nullable: true })
    slug?: string;

    @Column({ length: 100, nullable: true })
    funcoes_ministerio?: string;

    @Column({ length: 255, nullable: true })
    descricao_atividade?: string;

    @Column({ length: 255, nullable: true })
    descrição_curta?: string;

    @Column({ type: 'text', nullable: true })
    descrição_completa?: string;

    @Column({ length: 255, nullable: true })
    imagem_banner?: string;

    @Column({ length: 255, nullable: true })
    logo_ministerio?: string;

    @Column({ length: 100, nullable: true })
    lideranca_responsavel?: string;

    @Column({ length: 100, nullable: true })
    contato_email?: string;

    @Column({ length: 100, nullable: true })
    contato_telefone?: string;

    @Column({ length: 255, nullable: true })
    redes_sociais?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;

    @OneToMany(() => MinisterioFotos, (foto) => foto.ministerio, { cascade: true })
    fotos: MinisterioFotos[]; 
      
    


}