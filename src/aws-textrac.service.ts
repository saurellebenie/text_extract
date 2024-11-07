import { Injectable } from '@nestjs/common';
import {
  TextractClient,
  AnalyzeDocumentCommand,
  FeatureType,
} from '@aws-sdk/client-textract';
import * as AWS from 'aws-sdk';

@Injectable()
export class TextractService {
  private textract: TextractClient;

  constructor() {
    // Configurer AWS Textract avec les informations d'identification

    this.textract = new TextractClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async analyzeDocumentFromS3(documentName: string) {
    try {
      const params = {
        Document: {
          S3Object: {
            Bucket: process.env.BUCKET_NAME,
            Name: documentName,
          },
        },
        FeatureTypes: [
          FeatureType.TABLES,
          FeatureType.FORMS,
          FeatureType.SIGNATURES,
        ],
      };

      const command = new AnalyzeDocumentCommand(params);

      const response = await this.textract.send(command);
      console.log(response);
    } catch (error) {
      throw error;
    }
  }

  async analyzeDocumentFromBytes(buffer: Buffer) {
    const params = {
      Document: {
        Bytes: buffer,
      },
      FeatureTypes: [
        FeatureType.TABLES,
        FeatureType.FORMS,
        FeatureType.SIGNATURES,
      ],
    };

    // return new Promise((resolve, reject) => {
    //   this.textract.analyzeDocument(params, (err, data) => {
    //     if (err) reject(err);
    //     else resolve(data);
    //   });
    // });
  }
}
