import { Injectable } from '@nestjs/common';
import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExtractPDFParams,
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFResult,
} from '@adobe/pdfservices-node-sdk';

import * as fs from 'fs';

import * as AdmZip from 'adm-zip';

@Injectable()
export class PdfService {
  private credentials = new ServicePrincipalCredentials({
    clientId: process.env.PDF_SERVICES_CLIENT_ID,
    clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
  });
  private pdfServices = new PDFServices({ credentials: this.credentials });
  constructor() {}

  async extractTextFromPDF(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<any> {
    try {
      const inputAsset = await this.uploadPDF(inputFilePath);
      outputFilePath = './ExtractTextInfoFromPDF.zip';
      // Get content from the resulting asset(s)
      const resultAsset = await this.submitExtractJob(inputAsset);

      // save in zip file
      await this.saveExtractedContent(resultAsset, outputFilePath);

      // test for removing from zib
      return this.extractStructuredData(outputFilePath);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('PDF extraction failed.');
    }
  }

  private async uploadPDF(inputFilePath: string) {
    const readStream = fs.createReadStream(inputFilePath);
    return this.pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });
  }
  // Submit the job and get the job result
  private async submitExtractJob(inputAsset) {
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT],
    });
    const job = new ExtractPDFJob({ inputAsset, params });
    const pollingURL = await this.pdfServices.submit({ job });

    const pdfServicesResponse = await this.pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult,
    });

    return pdfServicesResponse.result.resource;
  }

  private async saveExtractedContent(resultAsset, outputFilePath: string) {
    const streamAsset = await this.pdfServices.getContent({
      asset: resultAsset,
    });
    const writeStream = fs.createWriteStream(outputFilePath);

    await new Promise((resolve, reject) => {
      streamAsset.readStream.pipe(writeStream);
      streamAsset.readStream.on('end', resolve);
      streamAsset.readStream.on('error', reject);
    });
    console.log(`Saved extracted content to ${outputFilePath}`);
  }

  private extractStructuredData(zipFilePath: string): any {
    const zip = new AdmZip(zipFilePath);
    const jsonData = zip.readAsText('structuredData.json');
    const data = JSON.parse(jsonData);

    return data.elements
      .filter((element) => element.Path.endsWith('/H1'))
      .map((element) => element.Text);
  }
}
