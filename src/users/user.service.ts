import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import  * as bcrypt from 'bcryptjs'; 


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(user: Partial<User>): Promise<User> {
        if (!user.password) {
        throw new Error('Password is required');
    }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = this.usersRepository.create({ ...user, password: hashedPassword})
        return this.usersRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findById(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async update(id: number, user: Partial<User>): Promise<User> {
        if(user.password){
           
            user.password = await bcrypt.hash(user.password, 10);
        }

        return this.usersRepository.save({ ...user, id });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.update(id, { isDeleted: true });
    }

// metodo que restaura os users deletados
    async restore(id: number): Promise<void> {
        await this.usersRepository.update(id, { isDeleted: false });
    }

    // Método para buscar inclusive os usuários deletados 
    findWithDeleted(): Promise<User[]> {
        return this.usersRepository.find({ 
            withDeleted: true 
        });
    }

    async validatePassword( email: string, password: string): Promise<User | null>{
        const user = await this.findByEmail(email);
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(password, user.password); // compara senha com hash
        if (!isPasswordValid) return null;
        return user;
    }

}