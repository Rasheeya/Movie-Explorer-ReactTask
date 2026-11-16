import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Compass, Star, Calendar, Clock, ChevronRight, Globe } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export const HeroBanner = ({ featuredMovies }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const { isFavourite, toggleFavourite, openModal } = useFavourites();

  const currentMovie = featuredMovies && featuredMovies.length > 0
    ? featuredMovies[activeIndex % featuredMovies.length]
    : null;

  // Auto-advance featured movie every 8 seconds
  useEffect(() => {
    if (!featuredMovies || featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredMovies.length);
      setImgError(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  if (!currentMovie) return null;

  const isFav = isFavourite(currentMovie.id);

  return (
    <section className="hero-section" aria-label="Featured Movie Spotlight">
      {/* Dynamic Backdrop Background */}
      <div className="hero-backdrop-container">
        <AnimatePresence mode="wait">
          {!imgError ? (
            <motion.img
              key={currentMovie.id}
              src={currentMovie.backdrop || currentMovie.poster}
              alt={currentMovie.title}
              className="hero-backdrop-img"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="hero-backdrop-fallback-bg" />
          )}
        </AnimatePresence>
        <div className="hero-gradient-overlay" />
        <div className="hero-bottom-fade" />
      </div>

      <div className="hero-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="hero-text-block"
          >
            {/* Spotlight Tag */}
            <div className="hero-spotlight-pill">
              <span className="spotlight-dot" />
              <span>SPOTLIGHT OF THE WEEK</span>
              {currentMovie.language && (
                <span className="spotlight-lang-tag">· {currentMovie.language}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="hero-title">{currentMovie.title}</h1>

            {/* Tagline */}
            {currentMovie.tagline && (
              <p className="hero-tagline">"{currentMovie.tagline}"</p>
            )}

            {/* Meta Attributes */}
            <div className="hero-meta-row">
              <div className="hero-rating-pill">
                <Star size={16} className="star-gold fill-current" />
                <span>{currentMovie.rating ? currentMovie.rating.toFixed(1) : '8.5'}</span>
              </div>

              <span className="hero-meta-dot">•</span>

              <div className="hero-meta-item">
                <Calendar size={15} />
                <span>{currentMovie.year}</span>
              </div>

              {currentMovie.duration && (
                <>
                  <span className="hero-meta-dot">•</span>
                  <div className="hero-meta-item">
                    <Clock size={15} />
                    <span>{currentMovie.duration}</span>
                  </div>
                </>
              )}

              <span className="hero-meta-dot">•</span>

              <div className="hero-genres-row">
                {currentMovie.genres && currentMovie.genres.slice(0, 3).map((g) => (
                  <span key={g} className="hero-genre-tag">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="hero-description">{currentMovie.description}</p>

            {/* Action Buttons */}
            <div className="hero-actions-row">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                className="btn btn-primary"
                onClick={() => openModal(currentMovie)}
              >
                <Play size={18} className="fill-current" />
                <span>Watch Trailer & Details</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                className={`btn btn-secondary ${isFav ? 'btn-fav-active' : ''}`}
                onClick={() => toggleFavourite(currentMovie)}
              >
                <Heart size={18} className={isFav ? 'fill-current text-crimson' : ''} />
                <span>{isFav ? 'Saved in Favourites' : 'Add to Favourites'}</span>
              </motion.button>

              <Link to="/explore" className="btn btn-ghost">
                <Compass size={18} />
                <span>View All Movies</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators / Controls */}
        {featuredMovies && featuredMovies.length > 1 && (
          <div className="hero-carousel-controls" aria-label="Featured movie carousel navigation">
            {featuredMovies.map((movie, idx) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={movie.id}
                type="button"
                className={`carousel-thumb-btn ${idx === activeIndex % featuredMovies.length ? 'active' : ''}`}
                onClick={() => {
                  setActiveIndex(idx);
                  setImgError(false);
                }}
                aria-label={`Switch spotlight to ${movie.title}`}
              >
                <span className="thumb-title">{movie.title}</span>
                {idx === activeIndex % featuredMovies.length && (
                  <motion.span
                    layoutId="heroActiveIndicator"
                    className="carousel-active-bar"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
