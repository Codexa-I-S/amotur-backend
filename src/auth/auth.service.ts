import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt' 
import { LoginDto } from './dto/login.dto';
import { Users } from '@prisma/client';
import { DateTime } from 'luxon'
@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService
    ){}

    async registerUser(userData: RegisterUserDto) {
        const userExists = await this.prisma.users.findUnique({
            where: {email: userData.email}
        })
    
        if(userExists) {
            throw new ConflictException("Email ja esta em uso")
        }
        
        const hashedpassword = await bcrypt.hash(userData.password, 10)
        const newUser = await this.prisma.users.create({
          data: {
            email: userData.email,
            password: hashedpassword
          },
          select: {
            id: true,
            email: true,
            role: true,

          } 
        })
        return newUser
    }

    async validateUser(email: string, password: string) {
      const user = await this.prisma.users.findUnique({where: {email}})

      if(!user) throw new UnauthorizedException('Credencíais inválidas!')

      if(!user.password) throw new UnauthorizedException(
        'Usuário não possui senha definida (Logar com o Google)'
      )

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) throw new UnauthorizedException('Credencíais inválidas!')

      return user;
    }

    async login(credentials: LoginDto) {
      const user = await this.validateUser(
        credentials.email,
        credentials.password
      )

      const data_hora = DateTime.now().setZone('America/Sao_Paulo').toISO(); 
      const data=DateTime.fromISO(data_hora).toISODate();
      
      await this.prisma.users.update({
        where: { id: user.id },
        data: { lastLoginAt: data },
      })
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      }
      return {
        access_token: this.jwt.sign(payload)
      }
    }

    async findOrCreateGoogleUser({ googleId, email }){
        let user = await this.prisma.users.findUnique({
          where: { googleId }
        })

        if(!user){
          const findEmail = await this.prisma.users.findUnique({where: {email}})
          if(findEmail) throw new ConflictException('credenciais já cadastradas')
          user = await this.prisma.users.create({
            data: {
              email,
              googleId
            }
          })
        }

      const data_hora = DateTime.now().setZone('America/Sao_Paulo').toISO(); 
      const data=DateTime.fromISO(data_hora).toISODate();
     
      await this.prisma.users.update({
        where: { id: user.id },
        data: { lastLoginAt: data },
      })
        return user
    }

    async signJwtForUser(user: Users){
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role
      }
      return this.jwt.sign(payload)
    }

}
