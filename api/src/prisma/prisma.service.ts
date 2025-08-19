import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    await this.$connect();
    // Database connection established - logged via Prisma's built-in logging
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    await this.$transaction([this.book.deleteMany(), this.review.deleteMany()]);
  }
}
