import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Tech Conference 2023',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Event description',
    example: 'A conference about the latest in technology.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Brisbane Convention Centre, Brisbane, QLD 4000',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Event date',
    example: '2023-10-15',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
