import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PdfService } from './app.service';
import { TextractService } from './aws-textrac.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [PdfService, TextractService],
})
export class AppModule {}
