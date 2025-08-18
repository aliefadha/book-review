import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { WinstonLoggerService } from 'src/common/services/winston-logger.service';
import { bookAgent } from 'src/mastra';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
    constructor(
        private prismaService: PrismaService,
        private winstonLogger: WinstonLoggerService
    ) { }

    async findAll() {
        return await this.prismaService.book.findMany();
    }

    async findOne(id: string) {
        const book = await this.prismaService.book.findUnique({
            where: { id },
            include: { reviews: true }
        })
        if (!book) throw new NotFoundException('Book not found');
        return book
    }

    async createReview(id: string, createReviewDto: CreateReviewDto) {
        const book = await this.prismaService.book.findUnique({
            where: { id }
        });
        if (!book) throw new NotFoundException('Book not found');

        // Default fallback values
        let summary = 'Review analysis unavailable';
        let sentimentScore = 0.5;
        let tags = ['review'];
        let aiProcessingSuccessful = false;

        // Retry AI processing up to 3 times
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                this.winstonLogger.log(`AI processing attempt ${attempt}/3 for review`);

                const aiResult = await bookAgent.generate([
                    {
                        role: 'user',
                        content: createReviewDto.text,
                    }
                ]);

                // Clean the response text to remove markdown formatting
                let cleanText = aiResult.text.trim();
                if (cleanText.startsWith('```json')) {
                    cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                }

                try {
                    const aiResponse = JSON.parse(cleanText);
                    summary = aiResponse.summary || summary;
                    sentimentScore = aiResponse.sentimentScore || sentimentScore;
                    tags = aiResponse.tags || tags;
                } catch (parseError) {
                    this.winstonLogger.error(`Failed to parse AI response as JSON, using fallback values: ${parseError.message}`, '');
                    // Keep using the fallback values already set above
                }

                aiProcessingSuccessful = true;
                this.winstonLogger.log('AI processing completed successfully');
                break; // Exit retry loop on success

            } catch (error) {
                this.winstonLogger.error(`AI processing attempt ${attempt}/3 failed: ${error.message}`, error.stack || '');

                if (attempt === 3) {
                    // All retries failed - decide whether to save with fallback or reject
                    this.winstonLogger.error('All AI processing attempts failed. Rejecting review creation.', '');
                    throw new Error('AI service is currently unavailable. Please try again later.');
                }

                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }

        return await this.prismaService.review.create({
            data: {
                bookId: id,
                text: createReviewDto.text,
                reviewerName: createReviewDto.reviewerName,
                rating: createReviewDto.rating,
                summary,
                sentimentScore,
                tags,
            }
        })
    }
}
