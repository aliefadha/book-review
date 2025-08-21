import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { HomePage } from '../pages/HomePage';
import { TestUtils } from '../utils/test-utils';
import { mockBooks, mockReviews } from '../fixtures/test-data';

test.describe('Tab Mocking Examples', () => {
  let searchPage: SearchPage;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    testUtils = new TestUtils(page);
  });

  test('should mock tabs with custom search results', async () => {
    // Mock custom search results with specific counts
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 3),
      reviews: mockReviews.slice(0, 2),
      totalResults: 5,
      query: 'custom search'
    });

    await searchPage.goto();
    await searchPage.searchFor('custom search');

    // Verify tabs appear with correct counts
    await searchPage.verifyPageElementsAfterSearch();
    expect(await searchPage.getTabBadgeCount('books')).toBe("3");
    expect(await searchPage.getTabBadgeCount('reviews')).toBe("2");

    // Test tab switching
    await searchPage.switchToTab('reviews');
    await searchPage.verifyTabIsActive('reviews');

    await searchPage.switchToTab('books');
    await searchPage.verifyTabIsActive('books');
  });

  test('should mock only books results (empty reviews tab)', async () => {
    // Mock search with only books, no reviews
    await testUtils.mockSearchResultsOnlyBooks(4);

    await searchPage.goto();
    await searchPage.searchFor('books only');

    // Verify tabs appear
    await searchPage.verifyPageElementsAfterSearch();
    expect(await searchPage.getTabBadgeCount('books')).toBe("3");
    expect(await searchPage.getTabBadgeCount('reviews')).toBe("0");

    // Switch to reviews tab and verify it's empty
    await searchPage.switchToTab('reviews');
    await searchPage.verifyTabIsActive('reviews');
    await expect(searchPage.page.getByText('No reviews found for this search.')).toBeVisible();
  });

  test('should mock only reviews results (empty books tab)', async () => {
    // Mock search with only reviews, no books
    await testUtils.mockSearchResultsOnlyReviews(3);

    await searchPage.goto();
    await searchPage.searchFor('reviews only');

    // Verify tabs appear
    await searchPage.verifyPageElementsAfterSearch();
    expect(await searchPage.getTabBadgeCount('books')).toBe("0");
    expect(await searchPage.getTabBadgeCount('reviews')).toBe("3");

    // Switch to books tab and verify it's empty
    await searchPage.switchToTab('books');
    await searchPage.verifyTabIsActive('books');
    await expect(searchPage.page.getByText('No books found for this search.')).toBeVisible();
  });

  test('should mock empty search results (no tabs)', async () => {
    // Mock search with no results
    await testUtils.mockEmptySearchResults();

    await searchPage.goto();
    await searchPage.searchFor('no results');

    // Verify tabs do not appear
    await searchPage.verifyPageElements();
    await searchPage.verifyPageElementsBeforeSearch();
    await expect(searchPage.page.getByText('No results found for "no results"')).toBeVisible();
  });

  test('should test tab persistence during navigation', async () => {
    // Mock search results with both books and reviews
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 2),
      totalResults: 4,
      query: 'gatsby'
    });

    await searchPage.goto();
    await searchPage.searchFor('gatsby');

    // Switch to reviews tab
    await searchPage.switchToTab('reviews');
    await searchPage.page.waitForTimeout(500);
    await searchPage.verifyTabIsActive('reviews');

    // Navigate to a book and back
    await searchPage.switchToTab('books');
    await searchPage.page.waitForTimeout(500);
    await searchPage.clickBookResult(0);

    // Navigate back to home
    await searchPage.page.goto('/');

    // Verify we're back on the home page
    const homePage = new HomePage(searchPage.page);
    await homePage.verifyPageElements();
    await expect(searchPage.page).toHaveURL('/');

  });

  test('should handle large result sets in tabs', async () => {
    // Mock search with maximum available results
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks, // All available books
      reviews: mockReviews, // All available reviews
      totalResults: mockBooks.length + mockReviews.length,
      query: 'large dataset'
    });

    await searchPage.goto();
    await searchPage.searchFor('large dataset');

    // Verify all results are displayed in tabs
    await searchPage.verifyPageElementsAfterSearch();
    expect(await searchPage.getTabBadgeCount('books')).toBe(mockBooks.length.toLocaleString());
    expect(await searchPage.getTabBadgeCount('reviews')).toBe(mockReviews.length.toLocaleString());

    // Verify both tabs have content
    await searchPage.switchToTab('books');
    await searchPage.verifyHasResults('books');

    await searchPage.switchToTab('reviews');
    await searchPage.verifyHasResults('reviews');
  });
});