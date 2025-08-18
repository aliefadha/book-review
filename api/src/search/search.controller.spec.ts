import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from '../common/services/search.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    const mockSearchResults = {
      query: 'test',
      books: [
        {
          id: '1',
          title: 'Test Book',
          author: 'Test Author',
          description: 'Test Description',
          coverImageUrl: 'http://example.com/cover.jpg',
          matchType: 'title',
        },
      ],
      reviews: [
        {
          id: '1',
          bookId: '1',
          reviewerName: 'Test Reviewer',
          text: 'Test Review',
          rating: 5,
          book: {
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
          },
          matchType: 'text',
        },
      ],
      totalResults: 2,
    };

    it('should return search results for valid query', async () => {
      mockSearchService.search.mockResolvedValue(mockSearchResults);

      const result = await controller.search({ query: 'test' });

      expect(result).toBe(mockSearchResults);
      expect(mockSearchService.search).toHaveBeenCalledWith('test');
    });

    it('should throw BadRequest exception for empty query', async () => {
      await expect(controller.search({ query: '' }))
        .rejects
        .toThrow(new HttpException('Search query cannot be empty', HttpStatus.BAD_REQUEST));

      expect(mockSearchService.search).not.toHaveBeenCalled();
    });

    it('should throw BadRequest exception for whitespace-only query', async () => {
      await expect(controller.search({ query: '   ' }))
        .rejects
        .toThrow(new HttpException('Search query cannot be empty', HttpStatus.BAD_REQUEST));

      expect(mockSearchService.search).not.toHaveBeenCalled();
    });

    it('should handle search service errors gracefully', async () => {
      mockSearchService.search.mockRejectedValue(new Error('Database error'));

      await expect(controller.search({ query: 'test' }))
        .rejects
        .toThrow(new HttpException('An error occurred while searching', HttpStatus.INTERNAL_SERVER_ERROR));

      expect(mockSearchService.search).toHaveBeenCalledWith('test');
    });

    it('should pass through HttpExceptions from search service', async () => {
      const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
      mockSearchService.search.mockRejectedValue(httpError);

      await expect(controller.search({ query: 'test' }))
        .rejects
        .toThrow(httpError);

      expect(mockSearchService.search).toHaveBeenCalledWith('test');
    });
  });
});