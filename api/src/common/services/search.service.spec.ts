/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SearchService', () => {
  let service: SearchService;

  const mockPrismaService = {
    book: {
      findMany: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    const mockBooks = [
      {
        id: '1',
        title: 'The Great Book',
        author: 'John Author',
        description: 'A fantastic story',
        coverImageUrl: 'http://example.com/cover1.jpg',
      },
      {
        id: '2',
        title: 'Another Book',
        author: 'Jane Writer',
        description: 'Great adventure',
        coverImageUrl: 'http://example.com/cover2.jpg',
      },
    ];

    const mockReviews = [
      {
        id: '1',
        bookId: '1',
        reviewerName: 'John Reviewer',
        text: 'Great book!',
        rating: 5,
        book: {
          id: '1',
          title: 'The Great Book',
          author: 'John Author',
        },
      },
    ];

    it('should search books and reviews with matching query', async () => {
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);
      mockPrismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await service.search('great');

      expect(result.query).toBe('great');
      expect(result.totalResults).toBe(3); // 2 books + 1 review
      expect(result.books).toHaveLength(2);
      expect(result.reviews).toHaveLength(1);

      // Verify book search parameters
      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'great' } },
            { author: { contains: 'great' } },
            { description: { contains: 'great' } },
          ],
        },
      });

      // Verify review search parameters
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { text: { contains: 'great' } },
            { reviewerName: { contains: 'great' } },
          ],
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        },
      });
    });

    it('should determine correct match type for books', async () => {
      const bookWithTitleMatch = {
        id: '1',
        title: 'Great Book',
        author: 'Some Author',
        description: 'Some description',
        coverImageUrl: 'http://example.com/cover.jpg',
      };

      const bookWithAuthorMatch = {
        id: '2',
        title: 'Some Book',
        author: 'Great Author',
        description: 'Some description',
        coverImageUrl: 'http://example.com/cover.jpg',
      };

      const bookWithDescriptionMatch = {
        id: '3',
        title: 'Some Book',
        author: 'Some Author',
        description: 'A great story',
        coverImageUrl: 'http://example.com/cover.jpg',
      };

      mockPrismaService.book.findMany.mockResolvedValue([
        bookWithTitleMatch,
        bookWithAuthorMatch,
        bookWithDescriptionMatch,
      ]);
      mockPrismaService.review.findMany.mockResolvedValue([]);

      const result = await service.search('great');

      expect(result.books[0].matchType).toBe('title');
      expect(result.books[1].matchType).toBe('author');
      expect(result.books[2].matchType).toBe('description');
    });

    it('should determine correct match type for reviews', async () => {
      const reviewWithTextMatch = {
        id: '1',
        bookId: '1',
        reviewerName: 'Some Reviewer',
        text: 'Great review',
        rating: 5,
        book: { id: '1', title: 'Book 1', author: 'Author 1' },
      };

      const reviewWithReviewerMatch = {
        id: '2',
        bookId: '2',
        reviewerName: 'Great Reviewer',
        text: 'Some review',
        rating: 4,
        book: { id: '2', title: 'Book 2', author: 'Author 2' },
      };

      mockPrismaService.book.findMany.mockResolvedValue([]);
      mockPrismaService.review.findMany.mockResolvedValue([
        reviewWithTextMatch,
        reviewWithReviewerMatch,
      ]);

      const result = await service.search('great');

      expect(result.reviews[0].matchType).toBe('text');
      expect(result.reviews[1].matchType).toBe('reviewerName');
    });

    it('should handle empty search results', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([]);
      mockPrismaService.review.findMany.mockResolvedValue([]);

      const result = await service.search('nonexistent');

      expect(result.query).toBe('nonexistent');
      expect(result.totalResults).toBe(0);
      expect(result.books).toHaveLength(0);
      expect(result.reviews).toHaveLength(0);
    });

    it('should trim and lowercase search query', async () => {
      await service.search('  GREAT  ');

      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: expect.arrayContaining([
              { title: { contains: 'great' } },
              { author: { contains: 'great' } },
              { description: { contains: 'great' } },
            ]) as any,
          },
        }),
      );
    });
  });
});
