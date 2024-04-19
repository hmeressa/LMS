import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class Role {
  @ApiProperty({
    description: 'role name must be unique.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiProperty({
    description: 'Short description about the role.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
