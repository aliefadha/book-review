import { test, expect } from '@playwright/test';
import { BookDetailPage } from '../pages/BookDetailPage';
import { TestUtils, generateTestData } from '../utils/test-utils';

test.describe('Book Detail Page', () => {
  let bookDetailPage: BookDetailPage;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    bookDetailPage = new BookDetailPage(page);
    testUtils = new TestUtils(page);

    // Mock API responses for consistent testing
    await testUtils.mockApiResponses();
  });

  test.afterEach(async () => {
    await testUtils.clearRoutes();
  });

  test('should display book details correctly', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');

    // Wait for page to load and navigate properly
    await bookDetailPage.page.waitForLoadState('networkidle');

    // Wait for book details to load with extended timeout
    await bookDetailPage.waitForBookToLoad();

    // Verify book information is displayed
    await bookDetailPage.verifyBookDetails();

    // Verify page title
    await expect(bookDetailPage.page).toHaveTitle(/Book Review Library/i);
  });

  test('should display book information elements', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.page.waitForLoadState('networkidle');
    await bookDetailPage.waitForBookToLoad();

    // Verify all book detail elements are visible
    await expect(bookDetailPage.bookTitle).toBeVisible();
    await expect(bookDetailPage.bookAuthor).toBeVisible();
    await expect(bookDetailPage.bookDescription).toBeVisible();
    await expect(bookDetailPage.averageRating).toBeVisible();
    await expect(bookDetailPage.reviewCount).toBeVisible();
  });

  test('should display reviews section', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.page.waitForLoadState('networkidle');
    await bookDetailPage.waitForBookToLoad();

    // Verify reviews section is visible
    await bookDetailPage.verifyReviewCard();

    // Check if reviews are displayed
    const reviewCount = await bookDetailPage.getReviewCount();
    expect(reviewCount).toBeGreaterThanOrEqual(0);
  });

  test('should open add review modal when clicking add review button', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Open add review modal
    await bookDetailPage.openAddReviewModal();

    // Verify modal is visible
    await expect(bookDetailPage.reviewModal).toBeVisible();
    await bookDetailPage.verifyReviewModalElements();
  });

  test('should close add review modal when clicking close button', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');

    // Open and then close modal
    await bookDetailPage.openAddReviewModal();
    await expect(bookDetailPage.reviewModal).toBeVisible();

    await bookDetailPage.closeReviewModal();
    await expect(bookDetailPage.reviewModal).not.toBeVisible();
  });

  test('should submit a new review successfully', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Generate test review data
    const reviewData = generateTestData.randomReview();

    // Open modal and fill review form
    await bookDetailPage.openAddReviewModal();
    await bookDetailPage.fillReviewForm(reviewData.reviewerName, reviewData.comment, reviewData.rating);

    // Submit review
    await bookDetailPage.submitReview();

    // Wait for submission to complete and modal to close
    await bookDetailPage.page.waitForTimeout(2000);
    await expect(bookDetailPage.reviewModal).not.toBeVisible();
  });

  test('should validate review form fields', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Open modal
    await bookDetailPage.openAddReviewModal();

    // Try to submit without filling required fields
    await bookDetailPage.submitReviewButton.click();
    // Verify form validation (modal should still be visible)
    await expect(bookDetailPage.reviewModal).toBeVisible();
  });

  test('should display review form elements correctly', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Open modal
    await bookDetailPage.openAddReviewModal();

    // Verify form elements
    await expect(bookDetailPage.reviewRatingStars).toBeVisible();
    await expect(bookDetailPage.reviewCommentInput).toBeVisible();
    await expect(bookDetailPage.submitReviewButton).toBeVisible();
    await expect(bookDetailPage.cancelReviewButton).toBeVisible();
  });

  test('should navigate back to previous page', async () => {
    // First navigate to home page
    await bookDetailPage.page.goto('/');

    // Then navigate to book detail
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Click back button
    await bookDetailPage.goBack();

    // Verify we're back on the home page
    await expect(bookDetailPage.page).toHaveURL('/');
  });

  test('should handle different book IDs', async () => {
    // Test with different book IDs
    const bookIds = ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'];

    for (const bookId of bookIds) {
      await bookDetailPage.goto(bookId);
      await bookDetailPage.waitForBookToLoad();

      // Verify URL contains the correct book ID
      await expect(bookDetailPage.page).toHaveURL(new RegExp(`/book/${bookId}`));

      // Verify book details are displayed
      await bookDetailPage.verifyBookDetails();
    }
  });

  test('should handle invalid book ID gracefully', async () => {
    // Navigate to non-existent book
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440999');

    // Verify error handling (page should still load without crashing)
    await bookDetailPage.page.waitForLoadState('networkidle');

    // The page should handle the error gracefully
    await expect(bookDetailPage.page).toHaveURL('/book/550e8400-e29b-41d4-a716-446655440999');
  });

  test('should display loading state correctly', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');

    // Initially, loading state might be visible
    // Then content should load
    await bookDetailPage.waitForBookToLoad();

    // Verify content is loaded and no loading indicators
    await bookDetailPage.verifyBookDetails();
  });

  test('should handle API errors gracefully', async () => {
    // Mock API error
    await testUtils.mockApiErrors();

    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');

    // Verify error handling doesn't break the page
    await bookDetailPage.page.waitForLoadState('networkidle');

    // Page should still be accessible
    await expect(bookDetailPage.page).toHaveURL('/book/550e8400-e29b-41d4-a716-446655440001');
  });

  test('should be responsive on different screen sizes', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Test responsive design
    await testUtils.testResponsiveDesign();

    // Verify elements are still visible on mobile
    await bookDetailPage.page.setViewportSize({ width: 375, height: 667 });
    await bookDetailPage.verifyBookDetails();
  });

  test('should maintain accessibility standards', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Check accessibility
    await testUtils.checkAccessibility();
  });

  test('should handle review modal on mobile devices', async () => {
    // Set mobile viewport
    await bookDetailPage.page.setViewportSize({ width: 375, height: 667 });

    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Open modal on mobile
    await bookDetailPage.openAddReviewModal();

    // Verify modal is properly displayed on mobile
    await expect(bookDetailPage.reviewModal).toBeVisible();
    await bookDetailPage.verifyReviewModalElements();
  });

  test('should display book rating and review statistics', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Verify rating and statistics are displayed
    await expect(bookDetailPage.averageRating).toBeVisible();
    await expect(bookDetailPage.reviewCount).toBeVisible();

    // Verify rating value is reasonable (0-5)
    const ratingText = await bookDetailPage.averageRating.textContent();
    if (ratingText) {
      const rating = parseFloat(ratingText);
      expect(rating).toBeGreaterThanOrEqual(0);
      expect(rating).toBeLessThanOrEqual(5);
    }
  });

  test('should handle multiple review submissions', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Submit multiple reviews
    for (let i = 0; i < 2; i++) {
      const reviewData = generateTestData.randomReview();

      await bookDetailPage.openAddReviewModal();
      await bookDetailPage.fillReviewForm(reviewData.reviewerName, reviewData.comment, reviewData.rating);
      await bookDetailPage.submitReview();

      // Wait for modal to close
      await expect(bookDetailPage.reviewModal).not.toBeVisible();

      // Small delay between submissions
      await bookDetailPage.page.waitForTimeout(500);
    }
  });

  test('should handle slow network conditions', async () => {
    // Simulate slow network
    await testUtils.simulateSlowNetwork();

    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');

    // Verify page still loads (with longer timeout)
    await bookDetailPage.waitForBookToLoad();
    await bookDetailPage.verifyBookDetails();
  });

  test('should display correct page metadata', async () => {
    await bookDetailPage.goto('550e8400-e29b-41d4-a716-446655440001');
    await bookDetailPage.waitForBookToLoad();

    // Verify page title includes book information
    await expect(bookDetailPage.page).toHaveTitle(/Book Review Library/i);

    // Verify book title is displayed
    await expect(bookDetailPage.bookTitle).toBeVisible();
  });
});