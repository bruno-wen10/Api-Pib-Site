import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lê token do header Authorization: Bearer
            ignoreExpiration: false, // não ignora expiração
            secretOrKey: process.env.JWT_SECRET, // mesma chave do JwtModule
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email }; // o que será retornado no request.user
    }
}