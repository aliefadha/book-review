import { Page, Locator, expect } from '@playwright/test';

export class BookDetailPage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly bookTitle: Locator;
  readonly bookAuthor: Locator;
  readonly bookDescription: Locator;
  readonly bookCover: Locator;
  readonly averageRating: Locator;
  readonly reviewCount: Locator;
  readonly addReviewButton: Locator;
  readonly reviewCards: Locator;
  readonly reviewModal: Locator;
  readonly reviewModalTitle: Locator;
  readonly reviewerNameInput: Locator;
  readonly reviewCommentInput: Locator;
  readonly reviewRatingStars: Locator;
  readonly submitReviewButton: Locator;
  readonly cancelReviewButton: Locator;
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backButton = page.getByRole('link', { name: /back to book list/i });
    this.bookTitle = page.getByRole('heading', { level: 1 }); // h1 element from Typography component="h1"
    this.bookAuthor = page.getByText(/^by /);
    this.bookDescription = page.getByText('Description').locator('..').locator('p');
    this.bookCover = page.locator('img').first(); // CardMedia renders as img
    this.averageRating = page.locator('.MuiRating-root').first();
    this.reviewCount = page.getByText(/\(\d+ reviews?\)/);
    this.addReviewButton = page.getByRole('button', { name: /Write a Review/i });
    this.reviewCards = page.locator('.MuiCard-root').filter({ has: page.locator('.MuiRating-root') });
    this.reviewModal = page.locator('[role="dialog"]');
    this.reviewModalTitle = page.locator('[role="dialog"]').getByRole('heading', { level: 2, name: 'Write a Review', exact: true });
    this.reviewerNameInput = page.getByLabel('Your Name');
    this.reviewCommentInput = page.getByRole('textbox', { name: 'Your Review' });
    this.reviewRatingStars = page.getByTestId('review-rating');
    this.submitReviewButton = page.getByRole('button', { name: /submit review/i });
    this.cancelReviewButton = page.getByRole('button', { name: /cancel/i });
    this.loadingIndicator = page.getByText(/loading/i);
    this.errorAlert = page.getByRole('alert');
  }

  async goto(bookId: string) {
    await this.page.goto(`/book/${bookId}`);
  }

  async waitForBookToLoad() {
    await expect(this.loadingIndicator).toHaveCount(0);
    await expect(this.bookTitle).toBeVisible({ timeout: 10000 });
  }

  async goBack() {
    await this.backButton.click();
  }

  async openAddReviewModal() {
    await this.addReviewButton.click();
    await expect(this.reviewModal).toBeVisible();
  }

  async closeReviewModal() {
    await this.cancelReviewButton.click();
    await expect(this.reviewModal).toHaveCount(0);
  }

  async fillReviewForm(reviewerName: string, comment: string, rating: number) {
    await this.reviewerNameInput.fill(reviewerName);
    await this.reviewCommentInput.fill(comment);

    // Click on the star rating (1-5) - MUI Rating component
    // Click directly on the nth star using the data-testid
    const starToClick = this.reviewRatingStars.locator('label').nth(rating - 1);
    await starToClick.click();
  }

  async submitReview() {
    await this.submitReviewButton.click();
    // Wait for modal to close or success state
    await this.page.waitForTimeout(1000); // Allow time for submission
  }

  async getBookTitle() {
    return await this.bookTitle.textContent();
  }

  async getBookAuthor() {
    return await this.bookAuthor.textContent();
  }

  async getBookDescription() {
    return await this.bookDescription.textContent();
  }

  async getReviewCount() {
    return await this.reviewCards.count();
  }

  async verifyBookDetails() {
    await expect(this.bookTitle).toBeVisible();
    await expect(this.bookAuthor).toBeVisible();
    await expect(this.bookDescription).toBeVisible();
    await expect(this.bookCover).toBeVisible();
    await expect(this.addReviewButton).toBeVisible();
  }

  async verifyReviewCard(index: number = 0, expectedReview?: { reviewerName: string; rating: number; reviewText: string }) {
    const reviewCard = this.reviewCards.nth(index);
    await expect(reviewCard).toBeVisible();

    if (expectedReview) {
      // Verify reviewer name (find h6 that contains the reviewer name specifically)
      const reviewerName = reviewCard.getByRole('heading', { level: 6 }).filter({ hasText: expectedReview.reviewerName });
      await expect(reviewerName).toHaveText(expectedReview.reviewerName);

      // Verify rating component
      const rating = reviewCard.locator('.MuiRating-root');
      await expect(rating).toBeVisible();

      // Verify review text (main content, not summary)
      const reviewText = reviewCard.locator('p').filter({ hasText: expectedReview.reviewText });
      await expect(reviewText).toBeVisible();
    } else {
      // Just verify basic structure exists - get all h6 elements
      const headings = reviewCard.getByRole('heading', { level: 6 });
      const rating = reviewCard.locator('.MuiRating-root');
      const reviewText = reviewCard.locator('p').first();

      await expect(headings.first()).toBeVisible();
      await expect(rating).toBeVisible();
      await expect(reviewText).toBeVisible();
    }
  }

  async verifyReviewModalElements() {
    await expect(this.reviewModal).toBeVisible();
    await expect(this.reviewModalTitle).toBeVisible();
    await expect(this.reviewerNameInput).toBeVisible();
    await expect(this.reviewCommentInput).toBeVisible();
    await expect(this.reviewRatingStars).toBeVisible();
    await expect(this.submitReviewButton).toBeVisible();
    await expect(this.cancelReviewButton).toBeVisible();
  }

  async verifyAverageRating() {
    await expect(this.averageRating).toBeVisible();
  }

  async verifyReviewCount() {
    await expect(this.reviewCount).toBeVisible();
  }
}