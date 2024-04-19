import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CourseMaterials {
  @ApiProperty({
    description: 'material title must be unique.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'credit hour of the course material, this is helpful to calculate the users progress in course.',
    type: Number,
  })
  @IsInt()
  crhr: number;

  @ApiProperty({
    description: 'material text content here.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
