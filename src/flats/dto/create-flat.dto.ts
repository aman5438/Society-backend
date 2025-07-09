import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFlatDto {
  @ApiProperty({ example: 'A-101' })
  @IsString()
  flatNumber: string;

  @ApiProperty({ example: '2BHK' })
  @IsString()
  type: string;
}
