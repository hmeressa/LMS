import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordEmail {
  @ApiProperty({
    description: 'Email must be a valid email address',
    type: String,
  })
  @IsEmail()
  email: string;
}
