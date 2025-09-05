import { IsNull, Repository } from "typeorm";
import { User } from "./users.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-users-dto";
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    if (!user.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  //  Buscar apenas usuários ativos (não deletados)
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  //  Buscar 1 usuário, mas só se não estiver deletado
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return this.usersRepository.save({ ...user, id });
  }

  //  Soft delete (não apaga, só preenche deletedAt)
  async remove(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  //  Restaurar usuário deletado - Falta criar função no controller
  async restore(id: string): Promise<void> {
    await this.usersRepository.restore(id);
  }

  //  Buscar todos (inclusive deletados) - Falta criar função no controller
  async findWithDeleted(): Promise<User[]> {
    return this.usersRepository.find({ withDeleted: true });
  }

  //  Validação de senha (só para usuários ativos)
  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
