import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/user.service';
import { User } from './../users/users.entity';
import { Injectable } from "@nestjs/common";



@Injectable()
export class AuthService{
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService

    ){}

    async login(email: string, password: string) {
        const user = await this.usersService.validatePassword(email, password);
        if (!user) return null;

        const payload = { email: user.email, sub: user.id }; // dados dentro do token
        return {
            access_token: this.jwtService.sign(payload), // gera token JWT
        };
    }
}