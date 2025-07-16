import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'FLAT_OWNER' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  societyId: number;

  @ApiProperty({ example: 101 })
  @Type(() => Number)
  @IsNumber()
  flatNumber: number;

  @ApiProperty({ example: '[]', type: 'array', items: { type: 'object' } })
  @IsOptional()
  documents?: any[];
}
