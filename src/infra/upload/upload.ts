// import { S3 } from 'aws-sdk';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
  S3Client,
} from '@aws-sdk/client-s3';
import 'dotenv/config';
import { randomUUID } from 'crypto';

const s3Aws = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

import { Uploader } from '@/application/upload/upload';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Upload implements Uploader {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async presignedURL(imageKey: string): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Expires: 60 * 10,
    };

    const url = await await getSignedUrl(s3Aws, new GetObjectCommand(params), {
      expiresIn: params.Expires,
    });
    return url;
  }

  async deleteImage(imageKey: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
    };

    await this.s3.send(new DeleteObjectCommand(params));
  }

  async getPublicImageUrl(imageKey: string): Promise<string> {
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;

    return url;
  }

  async uploadFilePublic(
    dataImage: Express.Multer.File,
    folderName?: string,
  ): Promise<string> {
    try {
      const idImage = randomUUID();
      const folderKey = folderName ? `${folderName}/${idImage}` : idImage;
      const bucketParams: any = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folderKey}`,
        ACL: 'public-read',
        Body: dataImage.buffer,
        ContentType: dataImage.mimetype,
      };
      await this.s3.send(new PutObjectCommand(bucketParams));
      return idImage;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadFile(
    dataImage: Express.Multer.File,
    folderName?: string,
  ): Promise<string> {
    try {
      const idImage = randomUUID();
      const folderKey = folderName ? `${folderName}/${idImage}` : idImage;
      const bucketParams: any = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folderKey}`,
        Body: dataImage.buffer,
        ContentType: dataImage.mimetype,
      };
      await this.s3.send(new PutObjectCommand(bucketParams));
      return idImage;
    } catch (error) {
      console.log(error);
    }
  }
}
