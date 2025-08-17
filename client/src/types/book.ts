export interface Books {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl?: string;
}

export interface Review {
  id: string;
  bookId: string;
  reviewerName: string;
  text: string;
  rating: number;
  summary: string;
  sentimentScore: number;
  tags: string[];
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl?: string;
  reviews: Review[];
}