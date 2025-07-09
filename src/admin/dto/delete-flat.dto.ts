import { IsOptional, IsString } from 'class-validator';

export class DeleteFlatDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  deletedBy?: string;
}
