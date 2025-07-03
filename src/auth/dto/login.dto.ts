import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString} from 'class-validator'

export class LoginDto {
    @ApiProperty({example:"jose@gmail.com",description:"jose@gmail.com"})
    @IsEmail({}, {message: "O email precisa ser válido"})
    email: string;

    @ApiProperty({example:"jose1234",description:"senha do usuário"})
    @IsString({message: "A senha precisa ser textual"})
    password: string;
}