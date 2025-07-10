import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || 'undefined-bucket';

    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'undefined-region',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'undefined_key',
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY || 'undefined_secret',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${randomUUID()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  }
}
