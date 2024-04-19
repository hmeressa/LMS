import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TeamName {
  @ApiProperty({
    description: 'Team(group) name.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  teamName: string;
}
