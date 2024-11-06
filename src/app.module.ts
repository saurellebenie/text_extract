import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PdfService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PdfService],
})
export class AppModule {}
