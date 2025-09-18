import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

   @Column({ type: 'varchar', length: 10, nullable: true })
    dateNascimento: string;


    @Column()
    politicasLGPD: boolean;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}