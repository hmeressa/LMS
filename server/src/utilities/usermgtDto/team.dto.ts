import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Team {
  @ApiProperty({
    description: 'Team(group) name must be unique.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @ApiPropertyOptional({
    description: 'Short description for a team(group)',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
