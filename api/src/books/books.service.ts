import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
    constructor(private prismaService: PrismaService) { }

    async findAll() {
    return await this.prismaService.book.findMany();
  }

    async findOne(id) {
        const book = await this.prismaService.book.findUnique({
            where: { id },
            include: { reviews: true }
        })
        if (!book) throw new NotFoundException('Book not found');
        return book
    }
}
