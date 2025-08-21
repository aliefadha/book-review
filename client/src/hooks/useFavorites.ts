import { useContext } from 'react';
import type { FavoritesContextType } from '../types/favorites';
import { FavoritesContext } from '../contexts/FavoritesContext';

// Custom hook to use favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};