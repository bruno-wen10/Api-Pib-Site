import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string ;

    @Column()
    perfil: string;

    @Column()
    userAdmin: boolean;

    @Column()
    telefone: string;

    @Column()
    dateNascimento: Date;

    @Column()
    politicasLGPD: boolean;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}