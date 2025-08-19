import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Reviewer name is required' })
  @MinLength(2, { message: 'Reviewer name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Reviewer name must not exceed 100 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  reviewerName: string;

  @IsString()
  @IsNotEmpty({ message: 'Review text is required' })
  @MinLength(10, { message: 'Review text must be at least 10 characters long' })
  @MaxLength(2000, { message: 'Review text must not exceed 2000 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  text: string;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;
}
