import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RoleName {
  @ApiProperty({
    description: 'Role name.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  roleName: string;
}
