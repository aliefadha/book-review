import { IsUUID, IsNotEmpty } from 'class-validator';

export class BookParamsDto {
  @IsUUID(4, { message: 'Book ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Book ID is required' })
  id: string;
}