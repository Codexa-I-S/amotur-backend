import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
    
    @ApiProperty({example:"jose@gmail.com",description:"email do usuário"})
    @IsEmail()
    email: string
    
    
    @ApiProperty({example:"jose1234",description:"senha do usuário"})
    @IsString()
    @MinLength(6)
    password: string
}