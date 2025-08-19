import { Injectable } from '@nestjs/common';

export interface ReviewEnhancement {
  summary: string;
  sentimentScore: number;
  tags: string[];
}

@Injectable()
export class MastraService {
  enhanceReview(reviewText: string): ReviewEnhancement {
    // NOTE: Currently using mock AI functionality for development
    // In production, this would integrate with actual Mastra AI API
    return {
      summary: this.generateSummary(reviewText),
      sentimentScore: this.analyzeSentiment(reviewText),
      tags: this.generateTags(reviewText),
    };
  }

  private generateSummary(text: string): string {
    // Mock implementation - replace with Mastra AI
    const words = text.split(' ').length;
    if (words > 50) return 'Detailed review with comprehensive analysis';
    if (words > 20) return 'Thoughtful review with good insights';
    return 'Brief but informative review';
  }

  private analyzeSentiment(text: string): number {
    // Mock implementation - replace with Mastra AI
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'amazing',
      'love',
      'wonderful',
    ];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointing'];

    const lowerText = text.toLowerCase();
    let score = 0.5; // neutral

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) score += 0.1;
    });

    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) score -= 0.1;
    });

    return Math.max(0, Math.min(1, score));
  }

  private generateTags(text: string): string[] {
    // Mock implementation - replace with Mastra AI
    const tags: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('character')) tags.push('character-development');
    if (lowerText.includes('plot')) tags.push('plot');
    if (lowerText.includes('writing')) tags.push('writing-style');
    if (lowerText.includes('recommend')) tags.push('recommended');
    if (lowerText.includes('classic')) tags.push('classic');

    return tags.length > 0 ? tags : ['general'];
  }
}
