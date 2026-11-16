import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Calendar, Play, Film, Sparkles, Globe } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export const MovieCard = ({ movie }) => {
  const { isFavourite, toggleFavourite, openModal } = useFavourites();
  const [imgError, setImgError] = useState(false);
  const isFav = isFavourite(movie.id);

  const handleCardClick = (e) => {
    // Prevent opening modal if clicking favourite button
    if (e.target.closest('.fav-toggle-btn')) {
      return;
    }
    openModal(movie);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    toggleFavourite(movie);
  };

  // Helper for rating color
  const getRatingColor = (rating) => {
    if (rating >= 8.5) return 'rating-gold';
    if (rating >= 7.5) return 'rating-green';
    return 'rating-blue';
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="movie-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(movie);
        }
      }}
      aria-label={`Movie: ${movie.title}, released in ${movie.year}, rating ${movie.rating}`}
    >
      {/* Poster Container */}
      <div className="card-poster-wrapper">
        {!imgError ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="card-poster"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-poster-fallback">
            <div className="fallback-badge">
              <Sparkles size={14} />
              <span>Stackly</span>
            </div>
            <Film size={44} className="fallback-icon" />
            <h4 className="fallback-title">{movie.title}</h4>
            <span className="fallback-year">{movie.year}</span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="card-top-badges">
          <div className={`rating-badge ${getRatingColor(movie.rating)}`}>
            <Star size={13} className="star-icon fill-current" />
            <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            type="button"
            className={`fav-toggle-btn ${isFav ? 'active' : ''}`}
            onClick={handleFavClick}
            aria-label={isFav ? `Remove ${movie.title} from favourites` : `Add ${movie.title} to favourites`}
            title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
          >
            <Heart
              size={17}
              className={`heart-icon ${isFav ? 'heart-filled' : 'heart-outline'}`}
            />
          </motion.button>
        </div>

        {/* Language Pill Badge on Poster */}
        {movie.language && (
          <div className="card-language-tag">
            <span>{movie.language}</span>
          </div>
        )}

        {/* Hover Overlay with Quick Details Trigger */}
        <div className="card-hover-overlay">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              openModal(movie);
            }}
          >
            <Play size={16} className="play-icon" />
            <span>View Details</span>
          </motion.button>
        </div>
      </div>

      {/* Card Info */}
      <div className="card-content">
        <div className="card-meta-row">
          <span className="card-year">
            <Calendar size={13} className="meta-icon" />
            {movie.year}
          </span>
          {movie.duration && <span className="card-duration">{movie.duration}</span>}
        </div>

        <h3 className="card-title" title={movie.title}>
          {movie.title}
        </h3>

        {/* Genres */}
        <div className="card-genres">
          {movie.genres && movie.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="genre-chip">
              {genre}
            </span>
          ))}
          {movie.genres && movie.genres.length > 2 && (
            <span className="genre-chip-more">+{movie.genres.length - 2}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};
