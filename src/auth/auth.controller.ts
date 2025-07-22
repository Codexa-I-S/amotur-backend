import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleService } from './google-auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private googleService: GoogleService
    ){}

    @ApiOperation({summary: 'Registrar um usuário'})
    @ApiResponse({status:201, description: "Usuário criado com sucesso!!"})
    @ApiResponse({status:409, description: "Email ja esta em uso"})
    @Post('register')
    async registerUser(@Body()userData: RegisterUserDto) {
        return this.authService.registerUser(userData)
    }
    
    @ApiOperation({summary: 'Login de Usuário'})
    @ApiResponse({status:200, description: "OK"})
    @ApiResponse({status:401, description: "Credenciais inválidas"})
    @Post('login')
    async loginUser(@Body() credentials: LoginDto): Promise<LoginResponseDto>{
        return this.authService.login(credentials)
    }

    @Post('google')
    @ApiOperation({ summary: 'Login com Google' })
    @ApiBody({ type: GoogleLoginDto, description: 'Token ID do Google (JWT)' })
    @ApiResponse({ status: 200, description: 'Login com sucesso. Retorna o access_token.' })
    @ApiResponse({ status: 401, description: 'Token inválido ou expirado.' })
    async loginWithGoogle(@Body() body: { idToken: string }){
        const access_token = await this.googleService.verify(
            body.idToken
        )

        return access_token
    }
}
