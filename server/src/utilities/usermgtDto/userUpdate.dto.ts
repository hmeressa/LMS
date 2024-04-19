import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
 
const gender = ['male', 'female'];
export class UsersUpdate {
  @ApiProperty({
    description: 'Id must be valid.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'First name of the user. Must be alpha character.',
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user. Must be alpha character.',
    type: String,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email must be valid.',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `phone must be 10 digit, needs revision!`,
    type: String,
  })
  @Length(10)
  phone: string; 

  @ApiProperty({
    description: `Gender must be one of this: ['male', 'female']; case sensitive.`,
    type: String,
  })
  @IsAlpha()
  @IsIn(gender)
  gender: string; 
}
