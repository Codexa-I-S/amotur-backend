import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

const rawSecretKey = process.env.SECRET_KEY

if(!rawSecretKey){
    throw new Error('SECRET_KEY não está definido')
}

const secretKey: string = rawSecretKey

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secretKey
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