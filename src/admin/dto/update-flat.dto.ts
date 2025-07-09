import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateFlatDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['VACANT', 'OCCUPIED'], {
    message: 'status must be either VACANT or OCCUPIED',
  })
  status?: string;
}
