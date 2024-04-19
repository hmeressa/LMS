import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Category {
  @ApiProperty({
    description: 'Category name must be unique.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({
    description: 'Short description about the category of courses.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
