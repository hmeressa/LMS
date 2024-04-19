import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @ApiPropertyOptional({
    description: 'Email must be a valid email address',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password must be between 8 and 20 characters long',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(20, {
    message: 'Password cannot be longer than 20 characters',
  })
  password: string;
}
