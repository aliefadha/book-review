export class CreateReviewDataDto {
  bookId: string;
  text: string;
  reviewerName: string;
  rating: number;
  summary: string;
  sentimentScore: number;
  tags: string[];
}