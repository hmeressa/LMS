import { ApiProperty } from '@nestjs/swagger';
import { IS_ISO8601, IsDate, IsEmail, IsISO8601, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CourseUsers {
  @ApiProperty({
    description: `Course name must be valid.`,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @ApiProperty({
    description: 'Email must be valid.',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Progress of the user from 100%. Hint: will be incremented per the user finishes some task.',
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({
    description: 'Time boundary for this course- has to be completed.',
    type: Date,
  })
  @ApiProperty({
    description: 'Time boundary for this course to be completed.',
    type: IS_ISO8601,
  })
  @IsISO8601()
  complitionTime: string;
}
