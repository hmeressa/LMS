import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator'; 

export class PositionChange {
  @ApiProperty({
    description: `user position in the company`,
    type: String,
  })
  @IsNotEmpty() 
  position: string;
}
