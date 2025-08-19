import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookParamsDto } from './dto/book-params.dto';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: BookParamsDto) {
    return this.bookService.findOne(params.id);
  }

  @Post(':id/reviews')
  createReview(@Param() params: BookParamsDto, @Body() body: CreateReviewDto) {
    return this.bookService.createReview(params.id, body);
  }
}
