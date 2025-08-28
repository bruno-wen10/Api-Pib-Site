import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "src/jwt/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config"; // 👈 Importe o ConfigModule e ConfigService

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        //registerAsync
        JwtModule.registerAsync({
            imports: [ConfigModule], // Garante que o ConfigModule está disponível
            inject: [ConfigService], // Injeta o ConfigService
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { 
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
                },
            }),
        }),
    ],
    controllers: [AuthController],  
    providers: [AuthService, JwtStrategy],
    exports: [AuthService], 
})
export class AuthModule {}
