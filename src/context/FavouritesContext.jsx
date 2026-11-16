import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOVIES_DATA } from '../data/moviesData';

const FavouritesContext = createContext(null);

const STORAGE_KEY = 'movie_explorer_favourites_v1';

export const FavouritesProvider = ({ children }) => {
  // Load favourite IDs from LocalStorage
  const [favouriteIds, setFavouriteIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading favourites from localStorage:', err);
    }
    // Initial state: empty list so user sees clean empty state until they add films
    return [];
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Sync favourite IDs to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
    } catch (err) {
      console.error('Error saving favourites to localStorage:', err);
    }
  }, [favouriteIds]);

  // Toast notification helper with auto-hide
  const showToast = (message) => {
    setToastMessage(message);
  };

  const dismissToast = () => {
    setToastMessage(null);
  };

  const isFavourite = (id) => {
    return favouriteIds.includes(Number(id));
  };

  const toggleFavourite = (movie) => {
    if (!movie) return;
    const movieId = Number(movie.id);
    if (isFavourite(movieId)) {
      setFavouriteIds((prev) => prev.filter((id) => id !== movieId));
      showToast(`Removed "${movie.title}" from Favourites`);
    } else {
      setFavouriteIds((prev) => [...prev, movieId]);
      showToast(`Added "${movie.title}" to Favourites`);
    }
  };

  const removeFavourite = (movieId, movieTitle) => {
    const idNum = Number(movieId);
    setFavouriteIds((prev) => prev.filter((id) => id !== idNum));
    showToast(movieTitle ? `Removed "${movieTitle}" from Favourites` : 'Removed from Favourites');
  };

  const clearFavourites = () => {
    setFavouriteIds([]);
    showToast('Cleared all favourites');
  };

  // Resolve favourite movie objects from IDs
  const favouriteMovies = MOVIES_DATA.filter((movie) => favouriteIds.includes(movie.id));

  // Modal helpers
  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favouriteIds,
        favouriteMovies,
        favouritesCount: favouriteIds.length,
        isFavourite,
        toggleFavourite,
        removeFavourite,
        clearFavourites,
        toastMessage,
        dismissToast,
        selectedMovie,
        openModal,
        closeModal
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};
