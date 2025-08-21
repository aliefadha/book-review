import type { FavoriteBook } from '../types/favorites';
import type { Book } from '../types/book';

const FAVORITES_STORAGE_KEY = 'bookReview_favorites';

/**
 * Service for managing user's favorite books
 * Uses localStorage for persistence since there's no user authentication system
 */
export class FavoritesService {
  /**
   * Get all favorites from localStorage
   */
  static getFavorites(): FavoriteBook[] {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!stored) return [];
      
      const favorites = JSON.parse(stored) as FavoriteBook[];
      // Validate the structure and filter out invalid entries
      return favorites.filter(fav => 
        fav.id && 
        fav.title && 
        fav.author && 
        fav.addedAt
      );
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  }

  /**
   * Save favorites to localStorage
   */
  static saveFavorites(favorites: FavoriteBook[]): void {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
      throw new Error('Failed to save favorites. Storage may be full.');
    }
  }

  /**
   * Add a book to favorites
   */
  static addToFavorites(book: Book | FavoriteBook): FavoriteBook {
    const favorites = this.getFavorites();
    
    // Check if already in favorites
    if (favorites.some(fav => fav.id === book.id)) {
      throw new Error('Book is already in favorites');
    }

    const favoriteBook: FavoriteBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverImageUrl: book.coverImageUrl,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, favoriteBook];
    this.saveFavorites(updatedFavorites);
    
    return favoriteBook;
  }

  /**
   * Remove a book from favorites
   */
  static removeFromFavorites(bookId: string): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== bookId);
    
    if (updatedFavorites.length === favorites.length) {
      throw new Error('Book not found in favorites');
    }
    
    this.saveFavorites(updatedFavorites);
  }

  /**
   * Check if a book is in favorites
   */
  static isFavorite(bookId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === bookId);
  }

  /**
   * Toggle favorite status of a book
   */
  static toggleFavorite(book: Book | FavoriteBook): { isFavorite: boolean; favoriteBook?: FavoriteBook } {
    const isCurrentlyFavorite = this.isFavorite(book.id);
    
    if (isCurrentlyFavorite) {
      this.removeFromFavorites(book.id);
      return { isFavorite: false };
    } else {
      const favoriteBook = this.addToFavorites(book);
      return { isFavorite: true, favoriteBook };
    }
  }

  /**
   * Clear all favorites
   */
  static clearFavorites(): void {
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('Failed to clear favorites');
    }
  }

  /**
   * Get favorites count
   */
  static getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  /**
   * Export favorites as JSON (for backup/sharing)
   */
  static exportFavorites(): string {
    const favorites = this.getFavorites();
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      version: '1.0',
      favorites,
    }, null, 2);
  }

  /**
   * Import favorites from JSON (for restore/sharing)
   */
  static importFavorites(jsonData: string, merge: boolean = false): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.favorites || !Array.isArray(data.favorites)) {
        throw new Error('Invalid favorites data format');
      }

      const importedFavorites = data.favorites as FavoriteBook[];
      
      if (merge) {
        const existingFavorites = this.getFavorites();
        const existingIds = new Set(existingFavorites.map(fav => fav.id));
        const newFavorites = importedFavorites.filter(fav => !existingIds.has(fav.id));
        const mergedFavorites = [...existingFavorites, ...newFavorites];
        this.saveFavorites(mergedFavorites);
      } else {
        this.saveFavorites(importedFavorites);
      }
    } catch (error) {
      console.error('Error importing favorites:', error);
      throw new Error('Failed to import favorites. Invalid data format.');
    }
  }
}

// Export individual functions for easier testing and usage
export const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  toggleFavorite,
  clearFavorites,
  getFavoritesCount,
  exportFavorites,
  importFavorites,
} = FavoritesService;