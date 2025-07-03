import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    async registerUser(@Body()userData: RegisterUserDto) {
        return this.authService.registerUser(userData)
    }
}
