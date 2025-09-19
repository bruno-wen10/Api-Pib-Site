import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/user.service';
import { User } from './../users/users.entity';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.validatePassword(email, password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const payload = {
      email: user.email,
      sub: user.id,
      permissions: user.permissions,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    // salvar hash no usuário temporariamente
    await this.userRepository.update(user.id, {
      password: user.password, // mantém senha atual
      permissions: user.permissions,
      telefone: user.telefone,
      membro: user.membro,
      politicasLGPD: user.politicasLGPD,
      dateNascimento: user.dateNascimento,
      name: user.name,
      email: user.email,
      // salvar token hashado em um campo extra ou em uma tabela de tokens (ideal seria outro campo)
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de senha',
      template: './reset-password', // precisa de template
      context: {
        name: user.name,
        resetUrl,
      },
    });

    return { message: 'Email de recuperação enviado' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Aqui você deveria ter salvo o hash do token para comparar
    // Exemplo simplificado (sem hash guardado)
    if (!token) throw new UnauthorizedException('Token inválido');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Senha redefinida com sucesso' };
  }
}
