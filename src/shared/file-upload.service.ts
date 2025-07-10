import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from './s3.service';

@Injectable()
export class FileUploadService {
  constructor(private s3Service: S3Service) {}

  async upload(file: Express.Multer.File): Promise<string> {
    const driver = process.env.UPLOAD_DRIVER || 'local';

    if (driver === 's3') {
      return this.s3Service.uploadFile(file);
    }

    const uploadPath = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const fullPath = path.join(uploadPath, filename);

    fs.writeFileSync(fullPath, file.buffer);

    return `${process.env.SOCIETY_BACKEND_URL}/uploads/${filename}`;
  }
}
