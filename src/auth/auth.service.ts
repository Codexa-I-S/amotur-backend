import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt' 
import { LoginDto } from './dto/login.dto';
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

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) throw new UnauthorizedException('Credencíais inválidas!')

      return user;
    }

    async login(credentials: LoginDto) {
      const user = await this.validateUser(
        credentials.email,
        credentials.password
      )
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      }
      return {
        access_token: this.jwt.sign(payload)
      }
    }

}
