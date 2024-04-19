import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class IsValidCode {
  @ApiProperty({
    description: 'Email must be a valid email address',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Verification code that you got through an email',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 8, {
    message: 'Verification code must be exactly 8 characters long.',
  })
  code: string;
}
