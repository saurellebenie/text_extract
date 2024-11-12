import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PdfService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { TextractService } from './aws-textrac.service';
import { fileUploadV3 } from 'file-handler.utils';

@Controller()
export class AppController {
  constructor(
    private readonly appService: PdfService,
    private readonly textractService: TextractService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor(
      'file',
      //   , {
      //   storage: diskStorage({
      //     destination: './uploads',
      //   }),
      // }
    ),
  )
  async getHello(@UploadedFile() file: Express.Multer.File) {
    try {
      const file_type = file.originalname.split('.')[1];

      // const bucket = await fileUploadV3({ file, fileName: file.originalname });
      // return this.appService.extractTextFromPDF(file.path, 'pdf');
      return this.textractService.analyzeDocumentFromS3(
        'bucket.key',
        file.path,
      );
    } catch (error) {
      throw error;
    }
  }
}
