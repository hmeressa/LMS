import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Announcement {

  @ApiProperty({
    description: 'Title of a notification.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Body of a notice.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  body: string; 

  @ApiProperty({
    description: 'For whom we wanna to send? eg. public, specific group, or specific user.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  target: string;
}