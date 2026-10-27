import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Shopping list' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: '<b>Milk</b>, eggs' })
  @IsString()
  @MaxLength(1000)
  content!: string;
}
