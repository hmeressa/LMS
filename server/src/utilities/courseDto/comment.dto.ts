import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Comment{
    @ApiProperty({
        description: 'Body of a comment.',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      body: string;   
}