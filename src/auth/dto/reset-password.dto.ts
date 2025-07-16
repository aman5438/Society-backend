import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'your-reset-token' }) 
  @IsString()
  token: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  newPassword: string;
}
