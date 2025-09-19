import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "src/auth/jwt/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config"; 
import { User } from "../users/users.entity";
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { 
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
                },
            }),
        }),
        TypeOrmModule.forFeature([User]),
       MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'bruno.wener.sousa82@gmail.com',
      pass: 'suasenhaouappkey',
    },
  },
  defaults: {
    from: 'bruno.wener.sousa82@gmail.com',
  },
})
    ],
    controllers: [AuthController],  
    providers: [AuthService, JwtStrategy],
    exports: [AuthService], 
})
export class AuthModule {}

