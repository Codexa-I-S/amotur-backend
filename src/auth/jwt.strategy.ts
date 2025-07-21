 import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(configService:ConfigService){
        const jwtSecret = configService.get<string>('SECRET_KEY')
        if(!jwtSecret){
            throw new Error('SECRET_KEY não está definida')
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret
        })
    }

    async validate(payload: any) {
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        }
    }
}