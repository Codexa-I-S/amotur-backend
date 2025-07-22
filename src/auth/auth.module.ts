import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleService } from './google-auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para que process.env funcione em toda a aplicação
    }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async (config:ConfigService) => ({
        secret:config.get<string>('SECRET_KEY'),
        signOptions: {expiresIn: '1d'}  
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, GoogleService]
})
export class AuthModule {}
