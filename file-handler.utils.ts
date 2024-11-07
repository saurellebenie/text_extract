import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';

export const fileUploadV3 = async (options: {
  file: Express.Multer.File;
  fileName: string;
}) => {
  try {
    console.log(getS3V3());

    const s3 = new S3Client(getS3V3());
    const filename = options.file.originalname.split('.')[1];
    const Key = `urbany_${randomUUID()}${filename}`;

    const command = new Upload({
      client: s3,
      params: {
        Bucket: process.env.BUCKET_NAME,
        Key,
        Body: options.file.buffer,
      },
    });

    console.log('options', {
      Bucket: process.env.BUCKET_NAME,
      Key,
      Body: options.file.buffer,
    });
    const response = await command.done();
    console.log(response);

    if (response) {
      return {
        location: response.ETag,
        key: Key,
        fieldName: options.file.fieldname,
      };
    }
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getS3V3 = () => {
  return {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  };
};
