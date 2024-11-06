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

@Controller()
export class AppController {
  constructor(private readonly appService: PdfService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  getHello(@UploadedFile() file: Express.Multer.File) {
    const file_type = file.originalname.split('.')[1];
    return this.appService.extractTextFromPDF(file.path, 'pdf');
  }
}
