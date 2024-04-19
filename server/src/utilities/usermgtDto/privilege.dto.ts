import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class Privilege { 
  @ApiProperty({
      description: 'Id of the privileges',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Is this role can view this resource?',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  view: boolean;

  @ApiProperty({
    description: 'Is this role can add new materials under this role?',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  add: boolean;

  @ApiProperty({
    description: 'Is this role can edit this resource?',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  edit: boolean;

  @ApiProperty({
    description: 'Is this role can delete materials under this resource?',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  delete: boolean; 
}
