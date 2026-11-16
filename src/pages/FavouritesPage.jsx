import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Compass,
  Trash2,
  Sparkles,
  Star,
  Film,
  Search,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { useFavourites } from '../context/FavouritesContext';

export const FavouritesPage = () => {
  const { favouriteMovies, clearFavourites, favouritesCount } = useFavourites();
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter favourites by search within favourites
  const filteredFavourites = useMemo(() => {
    if (!searchTerm.trim()) return favouriteMovies;
    const term = searchTerm.toLowerCase().trim();
    return favouriteMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        (m.language && m.language.toLowerCase().includes(term)) ||
        (m.genres && m.genres.some((g) => g.toLowerCase().includes(term)))
    );
  }, [favouriteMovies, searchTerm]);

  // Compute stats
  const averageRating = useMemo(() => {
    if (favouriteMovies.length === 0) return '0.0';
    const sum = favouriteMovies.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / favouriteMovies.length).toFixed(1);
  }, [favouriteMovies]);

  return (
    <div className="favourites-page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="favourites-header"
      >
        <div className="favourites-header-content">
          <div className="fav-pill-badge">
            <Heart size={16} className="fill-current text-crimson" />
            <span>PERSONAL WATCHLIST</span>
          </div>
          <h1 className="favourites-title">My Favourite Movies</h1>
          <p className="favourites-description">
            Your handpicked collection of films saved for movie nights. Stored directly in your browser with LocalStorage, ready whenever you return.
          </p>

          {/* Stats Summary Bar */}
          {favouritesCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="fav-stats-bar"
            >
              <div className="stat-card">
                <span className="stat-num">{favouritesCount}</span>
                <span className="stat-label">Saved {favouritesCount === 1 ? 'Movie' : 'Movies'}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-card">
                <div className="stat-with-icon">
                  <Star size={16} className="star-gold fill-current" />
                  <span className="stat-num">{averageRating}</span>
                </div>
                <span className="stat-label">Avg. IMDb Score</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-card">
                <span className="stat-num">LocalStorage</span>
                <span className="stat-label">Instant Persistence</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="favourites-body-wrapper">
        {favouritesCount === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="empty-favourites-container"
          >
            <div className="empty-heart-ring">
              <Heart size={44} className="empty-heart-icon" />
            </div>
            <h2 className="empty-fav-heading">No Favourite Movies Yet</h2>
            <p className="empty-fav-text">
              You haven't saved any movies to your favourites list yet. Click the heart icon on any movie card or detail modal to start curating your watchlist!
            </p>
            <div className="empty-fav-actions">
              <Link to="/explore" className="btn btn-primary btn-large">
                <Compass size={20} />
                <span>Explore Movies & Add Favourites</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Active Favourites List */
          <div className="favourites-active-content">
            {/* Quick Actions & Search within Favourites */}
            <div className="fav-toolbar">
              <div className="fav-search-wrapper">
                <Search size={18} className="fav-search-icon" />
                <input
                  type="text"
                  placeholder="Filter your saved movies by title or language..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="fav-search-input"
                  aria-label="Filter favourites"
                />
              </div>

              <div className="fav-toolbar-actions">
                <Link to="/explore" className="btn btn-ghost btn-small">
                  <Compass size={16} />
                  <span>Browse More</span>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="btn-clear-all-favs"
                  onClick={() => setShowClearConfirm(true)}
                  title="Remove all favourite movies"
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </motion.button>
              </div>
            </div>

            {/* Favourites Cards Grid */}
            <motion.div layout className="shelf-cards-grid">
              <AnimatePresence mode="popLayout">
                {filteredFavourites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredFavourites.length === 0 && (
              <div className="no-matches-box">
                <p>No saved movies match "{searchTerm}".</p>
                <button onClick={() => setSearchTerm('')} className="btn-link">
                  Reset Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="confirm-modal-backdrop"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="confirm-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="confirm-icon-danger">
                <AlertCircle size={32} />
              </div>
              <h3 className="confirm-title">Clear All Favourites?</h3>
              <p className="confirm-text">
                Are you sure you want to remove all {favouritesCount} movies from your favourites list? This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    clearFavourites();
                    setShowClearConfirm(false);
                  }}
                >
                  Yes, Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
