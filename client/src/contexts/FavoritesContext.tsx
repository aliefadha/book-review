import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSnackbar } from 'notistack';
import type { 
  FavoritesContextType, 
  FavoritesState, 
  FavoritesAction, 
  FavoriteBook 
} from '../types/favorites';
import type { Book } from '../types/book';
import { FavoritesService } from '../services/favoritesService';

// Initial state
const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
};

// Reducer function
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
        isLoading: false,
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        isLoading: false,
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
        isLoading: false,
      };
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Export context
export { FavoritesContext };

// Provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const favorites = FavoritesService.getFavorites();
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Error loading favorites:', error);
        enqueueSnackbar('Failed to load favorites', { variant: 'error' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadFavorites();
  }, [enqueueSnackbar]);

  // Add to favorites
  const addToFavorites = (book: Book | FavoriteBook) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const favoriteBook = FavoritesService.addToFavorites(book);
      dispatch({ type: 'ADD_FAVORITE', payload: favoriteBook });
      enqueueSnackbar(`"${book.title}" added to favorites`, { 
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      const message = error instanceof Error ? error.message : 'Failed to add to favorites';
      enqueueSnackbar(message, { variant: 'error' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Remove from favorites
  const removeFromFavorites = (bookId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const bookTitle = state.favorites.find(fav => fav.id === bookId)?.title || 'Book';
      FavoritesService.removeFromFavorites(bookId);
      dispatch({ type: 'REMOVE_FAVORITE', payload: bookId });
      enqueueSnackbar(`"${bookTitle}" removed from favorites`, { 
        variant: 'info',
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove from favorites';
      enqueueSnackbar(message, { variant: 'error' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check if book is favorite
  const isFavorite = (bookId: string): boolean => {
    return state.favorites.some(fav => fav.id === bookId);
  };

  // Toggle favorite status
  const toggleFavorite = (book: Book | FavoriteBook) => {
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  };

  // Clear all favorites
  const clearFavorites = () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      FavoritesService.clearFavorites();
      dispatch({ type: 'CLEAR_FAVORITES' });
      enqueueSnackbar('All favorites cleared', { 
        variant: 'info',
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error('Error clearing favorites:', error);
      const message = error instanceof Error ? error.message : 'Failed to clear favorites';
      enqueueSnackbar(message, { variant: 'error' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Context value
  const contextValue: FavoritesContextType = {
    favorites: state.favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: state.favorites.length,
    isLoading: state.isLoading,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};