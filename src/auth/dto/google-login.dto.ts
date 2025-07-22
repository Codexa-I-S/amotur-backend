import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...' })
  idToken: string;
}

export class GoogleLoginResponseDto {
  @ApiProperty({ example: 'jwt-gerado-pelo-backend' })
  access_token: string;
}