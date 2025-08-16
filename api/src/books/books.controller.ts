import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookParamsDto } from './dto/book-params.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) { }

    @Get()
    findAll() {
        return this.bookService.findAll()
    }

    @Get(':id')
    findOne(@Param() params: BookParamsDto) {
        return this.bookService.findOne(params.id)
    }
}
