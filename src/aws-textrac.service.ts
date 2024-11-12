import { Injectable } from '@nestjs/common';

import {
  TextractClient,
  AnalyzeExpenseCommand,
  AnalyzeExpenseCommandInput,
  AnalyzeExpenseCommandOutput,
  AnalyzeDocumentCommand,
  FeatureType,
  UnsupportedDocumentException,
} from '@aws-sdk/client-textract';
import * as AWS from 'aws-sdk';
import * as fs from 'fs/promises';

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

  async analyzeDocumentFromS3(documentName: string, file_path: any) {
    try {
      // const params = {
      //   Document: {
      //     S3Object: {
      //       Bucket: process.env.BUCKET_NAME,
      //       Name: documentName,
      //     },
      //   },
      //   FeatureTypes: [
      //     FeatureType.TABLES,
      //     FeatureType.FORMS,
      //     FeatureType.SIGNATURES,
      //   ],
      // };

      const recipe = await fs.readFile('./uploads/BdirEX0.png', 'base64');

      const input: AnalyzeExpenseCommandInput = {
        Document: {
          Bytes: Buffer.from(recipe, 'base64'),
        },
      };

      const command = new AnalyzeExpenseCommand(input);
      console.log(command.input);

      const response = await this.textract.send(command);

      // refuse pdf
      console.log(response.ExpenseDocuments);

      return response.ExpenseDocuments;
    } catch (error) {
      if (error instanceof UnsupportedDocumentException) {
        console.error('Unsupported document format:', error);
        // Handle the error, e.g., return an error message or retry with different parameters.
      } else {
        throw error;
      }
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
