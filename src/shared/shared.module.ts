import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [],
  providers: [S3Service, FileUploadService],
  exports: [S3Service, FileUploadService],
})
export class SharedModule {}
