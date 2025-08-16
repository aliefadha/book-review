import { Controller, Get, Query, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { SearchService } from '../common/services/search.service';
import { SearchQueryDto, SearchResultDto } from '../common/dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query(new ValidationPipe({ transform: true, whitelist: true })) 
    queryDto: SearchQueryDto
  ): Promise<SearchResultDto> {
    try {
      if (!queryDto.query || queryDto.query.trim().length === 0) {
        throw new HttpException(
          'Search query cannot be empty',
          HttpStatus.BAD_REQUEST
        );
      }

      const results = await this.searchService.search(queryDto.query);
      return results;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'An error occurred while searching',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}