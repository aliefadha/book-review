import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Search query must be at least 1 character long' })
  @Transform(({ value }) => value?.trim())
  query: string;
}

export class SearchResultDto {
  books: BookSearchResult[];
  reviews: ReviewSearchResult[];
  totalResults: number;
}

export class BookSearchResult {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  matchType: 'title' | 'author' | 'description';
}

export class ReviewSearchResult {
  id: string;
  bookId: string;
  reviewerName: string;
  text: string;
  rating: number;
  book: {
    id: string;
    title: string;
    author: string;
  };
  matchType: 'text' | 'reviewerName';
}