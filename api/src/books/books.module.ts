import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WinstonLoggerService } from 'src/common/services/winston-logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [BooksController],
  providers: [BooksService, WinstonLoggerService]
})
export class BooksModule { }
