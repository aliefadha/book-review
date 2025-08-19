export class ReviewResponseDto {
  id: string;
  bookId: string;
  reviewerName: string;
  text: string;
  rating: number;
  summary: string; // AI-generated
  sentimentScore: number; // AI-generated
  tags: string[]; // AI-generated
  createdAt: Date;
}
