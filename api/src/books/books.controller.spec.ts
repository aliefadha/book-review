import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createReview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ];
      mockBooksService.findAll.mockResolvedValue(mockBooks);

      const result = await controller.findAll();

      expect(result).toBe(mockBooks);
      expect(mockBooksService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const mockBook = {
        id: '1',
        title: 'Book 1',
        reviews: [],
      };
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne({ id: '1' });

      expect(result).toBe(mockBook);
      expect(mockBooksService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when book is not found', async () => {
      mockBooksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne({ id: '999' })).rejects.toThrow(NotFoundException);
      expect(mockBooksService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('createReview', () => {
    const mockCreateReviewDto = {
      text: 'Great book!',
      reviewerName: 'John Doe',
      rating: 5,
    };

    it('should create a review for a book', async () => {
      const mockReview = {
        id: '1',
        ...mockCreateReviewDto,
        bookId: '1',
        createdAt: new Date(),
      };
      mockBooksService.createReview.mockResolvedValue(mockReview);

      const result = await controller.createReview({ id: '1' }, mockCreateReviewDto);

      expect(result).toBe(mockReview);
      expect(mockBooksService.createReview).toHaveBeenCalledWith('1', mockCreateReviewDto);
    });

    it('should throw NotFoundException when book is not found', async () => {
      mockBooksService.createReview.mockRejectedValue(new NotFoundException());

      await expect(controller.createReview({ id: '999' }, mockCreateReviewDto))
        .rejects.toThrow(NotFoundException);
      expect(mockBooksService.createReview).toHaveBeenCalledWith('999', mockCreateReviewDto);
    });
  });
});
