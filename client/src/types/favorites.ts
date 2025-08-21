export interface FavoriteBook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl?: string;
  addedAt: string; // ISO date string when book was added to favorites
}

import type { Book } from './book';

export interface FavoritesContextType {
  favorites: FavoriteBook[];
  addToFavorites: (book: Book | FavoriteBook) => void;
  removeFromFavorites: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (book: Book | FavoriteBook) => void;
  clearFavorites: () => void;
  favoritesCount: number;
  isLoading: boolean;
}

export interface FavoritesState {
  favorites: FavoriteBook[];
  isLoading: boolean;
}

export type FavoritesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FAVORITES'; payload: FavoriteBook[] }
  | { type: 'ADD_FAVORITE'; payload: FavoriteBook }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' };