import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class MostSearchedCourse {
  @ApiProperty({
    description:
      'Counter will be updated per the user search, or new counter will be created for new combination of user and course.',
    type: Number,
  })
  @IsInt()
  counter: number;
}
