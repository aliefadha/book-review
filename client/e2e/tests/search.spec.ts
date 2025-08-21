import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { BookDetailPage } from '../pages/BookDetailPage';
import { TestUtils } from '../utils/test-utils';
import { mockBooks, mockReviews } from '../fixtures/test-data';

test.describe('Search Page', () => {
  let searchPage: SearchPage;
  let bookDetailPage: BookDetailPage;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    bookDetailPage = new BookDetailPage(page);
    testUtils = new TestUtils(page);

    // Mock API responses for consistent testing
    await testUtils.mockApiResponses();
  });

  test.afterEach(async () => {
    await testUtils.clearRoutes();
  });


  test('should display the search page with correct elements', async () => {
    await searchPage.goto();

    // Verify basic page elements are visible
    await searchPage.verifyPageElements();
    await searchPage.verifyPageElementsBeforeSearch();
  });

  test('should perform book search and display results', async () => {
    // Mock search results to ensure consistent test behavior
    await testUtils.mockSearchResultsOnlyBooks(2);

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');

    // Wait for search results to load
    await searchPage.waitForSearchResults();

    // Verify search results are displayed
    await searchPage.verifyPageElementsAfterSearch();
    await searchPage.verifyHasResults('books');

    // Verify search input value is preserved
    await searchPage.verifySearchInputValue('Gatsby');
  });

  test('should switch between Books and Reviews tabs', async () => {
    // Mock search results to ensure both tabs have content
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 3),
      reviews: mockReviews.slice(0, 2),
      totalResults: 5,
      query: 'Gatsby'
    });

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');

    // Wait for search results
    await searchPage.waitForSearchResults();
    await searchPage.verifyPageElementsAfterSearch();

    // Switch to Reviews tab
    await searchPage.switchToTab('reviews');
    await searchPage.verifyTabIsActive('reviews');
    await searchPage.verifyHasResults('reviews');

    // Switch back to Books tab
    await searchPage.switchToTab('books');
    await searchPage.verifyTabIsActive('books');
    await searchPage.verifyHasResults('books');
  });

  test('should display review search results correctly', async () => {
    // Mock search results with reviews to test review tab
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 3),
      totalResults: 5,
      query: 'Gatsby'
    });

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');

    // Wait for search results
    await searchPage.waitForSearchResults();

    // Switch to Reviews tab
    await searchPage.switchToTab('reviews');
    await searchPage.verifyTabIsActive('reviews');

    // Verify review results are displayed
    await searchPage.verifyHasResults('reviews');
  });

  test('should handle empty search results', async () => {
    // Mock empty search results
    await testUtils.mockEmptySearchResults();

    await searchPage.goto();
    await searchPage.searchFor('nonexistentbook12345');

    // Wait for search to complete
    await searchPage.waitForSearchResults();

    // Verify no results message is displayed
    await searchPage.verifyNoResults();
  });

  test('should handle search input debouncing', async () => {
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 3),
      totalResults: 5,
      query: 'Gatsby'
    });
    await searchPage.goto();

    // Type characters rapidly
    await searchPage.searchFor('G');
    await searchPage.waitForSearchResults();
    await searchPage.searchFor('Ga');
    await searchPage.waitForSearchResults();
    await searchPage.searchFor('Gat');
    await searchPage.waitForSearchResults();
    await searchPage.searchFor('Gats');
    await searchPage.waitForSearchResults();
    await searchPage.searchFor('Gatsby');

    // Wait for debounced search to complete
    await searchPage.waitForSearchResults();

    // Verify search results are displayed
    await searchPage.verifyPageElementsAfterSearch();
    await searchPage.verifySearchInputValue('Gatsby');
    await searchPage.verifySearchResultsHeader('Gatsby');
  });

  test('should clear search results when input is cleared', async () => {
    await searchPage.goto();
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 3),
      totalResults: 5,
      query: 'Gatsby'
    });

    // Perform search to display results
    await searchPage.searchFor('Gatsby');
    await searchPage.waitForSearchResults();

    // Verify search results are displayed
    await searchPage.verifyPageElementsAfterSearch();

    // Clear the search input
    await searchPage.clearSearch();

    // Verify search results are cleared
    await searchPage.verifyPageElementsBeforeSearch();
    await searchPage.verifySearchInputValue('');
  });

  test('should navigate to book detail from search results', async () => {
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 3),
      totalResults: 5,
      query: 'Gatsby'
    });

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');

    // Wait for search results and click on first book
    await searchPage.waitForSearchResults();
    await searchPage.clickBookResult(0);

    // Verify navigation to book detail page
    await bookDetailPage.verifyBookDetails();
  });

  test('should maintain search state when switching tabs', async () => {
    await searchPage.goto();
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 3),
      reviews: mockReviews.slice(0, 2),
      totalResults: 5,
      query: 'Gatsby'
    });

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');

    // Wait for search results
    await searchPage.waitForSearchResults();
    await searchPage.verifyPageElementsAfterSearch();

    // Switch to Reviews tab
    await searchPage.switchToTab('reviews');
    await searchPage.verifyTabIsActive('reviews');
    await searchPage.verifySearchInputValue('Gatsby');

    // Switch back to Books tab
    await searchPage.switchToTab('books');
    await searchPage.verifyTabIsActive('books');
    await searchPage.verifySearchInputValue('Gatsby');
  });

  test('should handle special characters in search', async () => {
    await searchPage.goto();
    await searchPage.searchFor('test@#$%');

    // Wait for search to complete
    await searchPage.waitForSearchResults();

    // Verify search input value is preserved
    await searchPage.verifySearchInputValue('test@#$%');
  });

  test('should be responsive on different screen sizes', async () => {
    // Test mobile viewport
    await searchPage.page.setViewportSize({ width: 375, height: 667 });
    await searchPage.goto();
    await searchPage.verifyPageElements();

    // Test tablet viewport
    await searchPage.page.setViewportSize({ width: 768, height: 1024 });
    await searchPage.verifyPageElements();

    // Test desktop viewport
    await searchPage.page.setViewportSize({ width: 1920, height: 1080 });
    await searchPage.verifyPageElements();
  });

  test('should maintain accessibility standards', async () => {
    await searchPage.goto();


    // Check accessibility
    await testUtils.checkAccessibility();

    // Perform search and check accessibility again
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 3),
      totalResults: 5,
      query: 'Gatsby'
    });
    await searchPage.searchFor('Gatsby');
    await searchPage.waitForSearchResults();
    await testUtils.checkAccessibility();
  });

  test('should handle API errors gracefully', async () => {
    // Mock API errors
    await testUtils.mockApiErrors();

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');

    // Verify error handling
    await expect(searchPage.page.getByText(/No results found/i)).toBeVisible();
  });

  test('should handle long search queries', async () => {
    const longQuery = 'a'.repeat(100);

    await searchPage.goto();
    await searchPage.searchFor(longQuery);

    // Wait for search to complete
    await searchPage.waitForSearchResults();

    // Verify search input handles long queries
    await searchPage.verifySearchInputValue(longQuery);
  });
});