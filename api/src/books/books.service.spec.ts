/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WinstonLoggerService } from 'src/common/services/winston-logger.service';
import { bookAgent } from 'src/mastra';

jest.mock('../mastra', () => ({
  bookAgent: {
    generate: jest.fn(),
  },
}));

describe('BooksService', () => {
  let service: BooksService;

  const mockPrismaService = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    review: {
      create: jest.fn(),
    },
  };

  const mockWinstonLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      if (typeof callback === 'function') {
        callback();
      }
      return {} as NodeJS.Timeout;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WinstonLoggerService,
          useValue: mockWinstonLogger,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ];
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);

      const result = await service.findAll();

      expect(result).toEqual(mockBooks);
      expect(mockPrismaService.book.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book with reviews when found', async () => {
      const mockBook = {
        id: '1',
        title: 'Book 1',
        reviews: [{ id: '1', text: 'Great book!' }],
      };
      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);

      const result = await service.findOne('1');

      expect(result).toEqual(mockBook);
      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { reviews: true },
      });
    });

    it('should throw NotFoundException when book is not found', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        include: { reviews: true },
      });
    });
  });

  describe('createReview', () => {
    const mockCreateReviewDto = {
      text: 'Great book!',
      reviewerName: 'John Doe',
      rating: 5,
    };

    const mockAiResponse = {
      text: JSON.stringify({
        summary: 'A positive review',
        sentimentScore: 0.8,
        tags: ['positive', 'recommended'],
      }),
    };

    it('should create a review with AI processing', async () => {
      const mockBook = { id: '1', title: 'Book 1' };
      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
      (bookAgent.generate as jest.Mock).mockResolvedValue(mockAiResponse);
      mockPrismaService.review.create.mockImplementation(({ data }) => data);

      const result = await service.createReview('1', mockCreateReviewDto);

      expect(result).toMatchObject({
        bookId: '1',
        text: mockCreateReviewDto.text,
        reviewerName: mockCreateReviewDto.reviewerName,
        rating: mockCreateReviewDto.rating,
        summary: 'A positive review',
        sentimentScore: 0.8,
        tags: ['positive', 'recommended'],
      });
    });

    it('should throw NotFoundException when book not found for review', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(
        service.createReview('999', mockCreateReviewDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should use fallback values when AI processing fails all retries', async () => {
      const mockBook = { id: '1', title: 'Book 1' };
      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
      (bookAgent.generate as jest.Mock).mockRejectedValue(
        new Error('AI Error'),
      );

      await expect(
        service.createReview('1', mockCreateReviewDto),
      ).rejects.toThrow(
        'AI service is currently unavailable. Please try again later.',
      );

      expect((() => bookAgent.generate).mock).toHaveBeenCalledTimes(3);
      expect(mockWinstonLogger.error).toHaveBeenCalledWith(
        'All AI processing attempts failed. Rejecting review creation.',
        '',
      );
    });
  });
});
