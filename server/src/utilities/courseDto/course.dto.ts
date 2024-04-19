import { ApiProperty } from '@nestjs/swagger';
import { IS_ISO8601, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class Course {
  @ApiProperty({
    description: 'Category name for this course.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({
    description: 'Course title must be unique.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Short description about the course.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  // @ApiProperty({
  //   description: 'Time boundary for this course will be completed.',
  //   type: Date,
  // })
  // @IsISO8601()
  // complitionTime: string;
} 