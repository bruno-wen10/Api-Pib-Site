import { IsNull, Repository } from 'typeorm';
import { User } from './users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-users-dto';
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
    // Busca usuário pelo e-mail, incluindo deletados
    const existingUser = await this.usersRepository.findOne({ where: { email: user.email }, withDeleted: true });
    if (existingUser && !existingUser.deletedAt) {
      // Usuário ativo, não pode cadastrar
      throw new (await import('@nestjs/common')).ConflictException('E-mail já cadastrado');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (existingUser && existingUser.deletedAt) {
      // Usuário deletado, restaura e atualiza dados
      await this.usersRepository.restore(existingUser.id);
      Object.assign(existingUser, {
        ...user,
        password: hashedPassword,
        permissions: user.permissions || {},
        deletedAt: null,
      });
      return this.usersRepository.save(existingUser);
    }
    // Usuário não existe, cria novo
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
      permissions: user.permissions || {},
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

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

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findWithDeleted(): Promise<User[]> {
    return this.usersRepository.find({ withDeleted: true });
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
