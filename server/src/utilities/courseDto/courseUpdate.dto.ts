import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CourseUpdate {
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

  @ApiProperty({
    description: 'Time boundary for this course has to be completed.',
    type: Date,
  })
  @IsISO8601()
  complitionTime: string;
} 