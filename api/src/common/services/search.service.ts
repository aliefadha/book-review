import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchResultDto, BookSearchResult, ReviewSearchResult } from '../dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(query: string): Promise<SearchResultDto> {
    const searchTerm = query.toLowerCase().trim();
    
    // Search books by title, author, and description
    const books = await this.searchBooks(searchTerm);
    
    // Search reviews by text and reviewer name
    const reviews = await this.searchReviews(searchTerm);
    
    return {
      books,
      reviews,
      totalResults: books.length + reviews.length
    };
  }

  private async searchBooks(searchTerm: string): Promise<BookSearchResult[]> {
    const books = await this.prismaService.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm
            }
          },
          {
            author: {
              contains: searchTerm
            }
          },
          {
            description: {
              contains: searchTerm
            }
          }
        ]
      }
    });

    return books.map(book => {
      let matchType: 'title' | 'author' | 'description' = 'title';
      
      if (book.title.toLowerCase().includes(searchTerm)) {
        matchType = 'title';
      } else if (book.author.toLowerCase().includes(searchTerm)) {
        matchType = 'author';
      } else if (book.description.toLowerCase().includes(searchTerm)) {
        matchType = 'description';
      }

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverImageUrl: book.coverImageUrl,
        matchType
      };
    });
  }

  private async searchReviews(searchTerm: string): Promise<ReviewSearchResult[]> {
    const reviews = await this.prismaService.review.findMany({
      where: {
        OR: [
          {
            text: {
              contains: searchTerm
            }
          },
          {
            reviewerName: {
              contains: searchTerm
            }
          }
        ]
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true
          }
        }
      }
    });

    return reviews.map(review => {
      let matchType: 'text' | 'reviewerName' = 'text';
      
      if (review.text.toLowerCase().includes(searchTerm)) {
        matchType = 'text';
      } else if (review.reviewerName.toLowerCase().includes(searchTerm)) {
        matchType = 'reviewerName';
      }

      return {
        id: review.id,
        bookId: review.bookId,
        reviewerName: review.reviewerName,
        text: review.text,
        rating: review.rating,
        book: review.book,
        matchType
      };
    });
  }
}