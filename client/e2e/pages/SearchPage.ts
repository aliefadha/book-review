import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearButton: Locator;
  readonly tabsContainer: Locator;
  readonly booksTab: Locator;
  readonly reviewsTab: Locator;
  readonly bookResults: Locator;
  readonly reviewResults: Locator;
  readonly loadingSpinner: Locator;
  readonly noResultsMessage: Locator;
  readonly errorAlert: Locator;
  readonly bookCards: Locator;
  readonly reviewCards: Locator;
  readonly searchResultsHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Search Books & Reviews' });
    this.searchInput = page.getByRole('textbox', { name: /search/i });
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.clearButton = page.getByRole('button', { name: /clear/i });
    this.tabsContainer = page.getByRole('tablist', { name: 'search results tabs' });
    this.booksTab = page.getByRole('tab').filter({ hasText: 'Books' });
    this.reviewsTab = page.getByRole('tab').filter({ hasText: 'Reviews' });
    this.bookResults = page.locator('[role="tabpanel"]').first();
    this.reviewResults = page.locator('[role="tabpanel"]').last();
    this.loadingSpinner = page.locator('.MuiCircularProgress-root');
    this.noResultsMessage = page.getByText(/no.*found/i);
    this.errorAlert = page.getByRole('alert');
    this.bookCards = page.locator('[data-testid="search-book-card"]');
    this.reviewCards = page.locator('[data-testid="search-review-card"]');
    this.searchResultsHeader = page.getByRole('heading', { level: 5 }).filter({ hasText: /Search Results for/ });
  }

  async goto() {
    await this.page.goto('/search');
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async clearSearch() {
    await this.clearButton.click();
  }

  async switchToTab(tabName: 'books' | 'reviews') {
    if (tabName === 'books') {
      await this.booksTab.click();
    } else {
      await this.reviewsTab.click();
    }
    await this.page.waitForTimeout(500);
  }

  async waitForSearchResults() {
    // Wait for loading to finish
    await expect(this.loadingSpinner).toHaveCount(0);
  }

  async getBookResultsCount() {
    return await this.bookCards.count();
  }

  async getReviewResultsCount() {
    return await this.reviewCards.count();
  }

  async verifyPageElements() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async verifyPageElementsBeforeSearch() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    // Tabs should not be visible before search
    await expect(this.tabsContainer).not.toBeVisible();
  }

  async verifyPageElementsAfterSearch() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.tabsContainer).toBeVisible();
    await expect(this.booksTab).toBeVisible();
    await expect(this.reviewsTab).toBeVisible();
  }

  async verifySearchInputValue(expectedValue: string) {
    await expect(this.searchInput).toHaveValue(expectedValue);
  }

  async verifyTabIsActive(tabName: 'books' | 'reviews') {
    const tab = tabName === 'books' ? this.booksTab : this.reviewsTab;
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  async verifyNoResults() {
    await expect(this.noResultsMessage).toBeVisible();
  }

  async verifyHasResults(type: 'books' | 'reviews') {
    if (type === 'books') {
      await expect(this.bookCards.first()).toBeVisible();
    } else {
      await expect(this.reviewCards.first()).toBeVisible();
    }
  }

  async clickBookResult(index: number = 0) {
    await this.bookCards.nth(index).click();
  }

  async getTabBadgeCount(tabName: 'books' | 'reviews') {
    const tab = tabName === 'books' ? this.booksTab : this.reviewsTab;
    const badge = tab.locator('.MuiBadge-badge');
    if (await badge.isVisible()) {
      return await badge.textContent();
    }
    return '0';
  }

  async verifySearchResultsHeader(expectedQuery: string) {
    await expect(this.searchResultsHeader).toBeVisible();
    await expect(this.searchResultsHeader).toHaveText(`Search Results for "${expectedQuery}"`);
  }

  async getSearchQueryFromHeader() {
    const headerText = await this.searchResultsHeader.textContent();
    const match = headerText?.match(/Search Results for "(.+)"/);
    return match ? match[1] : null;
  }
}