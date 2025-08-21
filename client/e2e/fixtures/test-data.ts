/**
 * Test data fixtures for e2e tests
 */

export const mockBooks = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age.',
    coverImageUrl: 'https://example.com/gatsby.jpg',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence.',
    coverImageUrl: 'https://example.com/mockingbird.jpg',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel.',
    coverImageUrl: 'https://example.com/1984.jpg',
  }
];

export const mockReviews = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    bookId: '550e8400-e29b-41d4-a716-446655440001',
    rating: 5,
    text: 'An absolutely brilliant masterpiece!',
    reviewerName: 'John Doe',
    summary: 'Highly positive review praising the book as a masterpiece',
    sentimentScore: 0.9,
    tags: ['classic', 'masterpiece', 'brilliant'],
    book: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald'
    },
    matchType: 'text'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    bookId: '550e8400-e29b-41d4-a716-446655440001',
    rating: 4,
    text: 'Great book, highly recommend.',
    reviewerName: 'Jane Smith',
    summary: 'Positive review with strong recommendation',
    sentimentScore: 0.8,
    tags: ['great', 'recommended', 'positive'],
    book: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald'
    },
    matchType: 'text'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    bookId: '550e8400-e29b-41d4-a716-446655440002',
    rating: 5,
    text: 'A timeless classic that everyone should read.',
    reviewerName: 'Bob Johnson',
    summary: 'Enthusiastic review highlighting the book as a timeless classic',
    sentimentScore: 0.95,
    tags: ['classic', 'timeless', 'must-read'],
    book: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee'
    },
    matchType: 'text'
  }
];

export const searchResults = {
  books: mockBooks.slice(0, 2),
  reviews: mockReviews.slice(0, 2)
};