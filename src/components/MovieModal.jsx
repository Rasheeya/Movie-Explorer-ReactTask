import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Heart,
  Calendar,
  Clock,
  User,
  Users,
  Play,
  Share2,
  Film,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export const MovieModal = () => {
  const { selectedMovie, closeModal, isFavourite, toggleFavourite } = useFavourites();
  const [showTrailer, setShowTrailer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (selectedMovie) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMovie, closeModal]);

  // Reset trailer state when movie changes
  useEffect(() => {
    setShowTrailer(false);
    setCopied(false);
  }, [selectedMovie]);

  if (!selectedMovie) return null;

  const isFav = isFavourite(selectedMovie.id);

  // Extract YouTube video ID to construct clean web link
  const ytVideoId = selectedMovie.trailerUrl ? selectedMovie.trailerUrl.split('/').pop() : '';
  const externalYouTubeUrl = ytVideoId ? `https://www.youtube.com/watch?v=${ytVideoId}` : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/explore?search=${encodeURIComponent(selectedMovie.title)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {selectedMovie && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-movie-title"
        >
          <motion.div
            key="modal-container"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Close Button */}
            <div className="modal-header-bar">
              <span className="modal-category-badge">
                <Film size={14} />
                <span>Movie Spotlight</span>
                {selectedMovie.language && (
                  <span className="modal-lang-badge">· {selectedMovie.language}</span>
                )}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="modal-close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Media Player or Banner */}
              {showTrailer && selectedMovie.trailerUrl ? (
                <div className="modal-video-wrapper">
                  <iframe
                    src={`${selectedMovie.trailerUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${selectedMovie.title} Trailer`}
                    className="modal-video-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="video-fallback-bar">
                    <span>Video player having trouble?</span>
                    {externalYouTubeUrl && (
                      <a
                        href={externalYouTubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-fallback-link"
                      >
                        Watch directly on YouTube <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Grid: Poster + Details */}
              <div className="modal-grid">
                {/* Poster Column */}
                <div className="modal-poster-col">
                  <img
                    src={selectedMovie.poster}
                    alt={`${selectedMovie.title} poster`}
                    className="modal-poster-img"
                    referrerPolicy="no-referrer"
                  />
                  {/* Trailer play trigger button underneath poster if trailer is not already open */}
                  {selectedMovie.trailerUrl && !showTrailer && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      className="modal-play-trailer-btn"
                      onClick={() => setShowTrailer(true)}
                    >
                      <Play size={16} className="fill-current" />
                      <span>Play HD Trailer</span>
                    </motion.button>
                  )}
                </div>

                {/* Info Column */}
                <div className="modal-info-col">
                  <h2 id="modal-movie-title" className="modal-title">
                    {selectedMovie.title}
                  </h2>

                  {selectedMovie.tagline && (
                    <p className="modal-tagline">"{selectedMovie.tagline}"</p>
                  )}

                  {/* Metadata Chips */}
                  <div className="modal-meta-chips">
                    <div className="meta-chip rating-chip">
                      <Star size={15} className="star-gold fill-current" />
                      <span className="chip-rating-num">{selectedMovie.rating ? selectedMovie.rating.toFixed(1) : '8.5'}</span>
                      {selectedMovie.voteCount && (
                        <span className="chip-votes">({selectedMovie.voteCount})</span>
                      )}
                    </div>

                    <div className="meta-chip">
                      <Calendar size={14} />
                      <span>{selectedMovie.releaseDate || selectedMovie.year}</span>
                    </div>

                    {selectedMovie.duration && (
                      <div className="meta-chip">
                        <Clock size={14} />
                        <span>{selectedMovie.duration}</span>
                      </div>
                    )}

                    {selectedMovie.language && (
                      <div className="meta-chip lang-chip">
                        <Globe size={14} />
                        <span>{selectedMovie.language}</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="modal-genres">
                    {selectedMovie.genres && selectedMovie.genres.map((g) => (
                      <span key={g} className="modal-genre-tag">
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Synopsis */}
                  <div className="modal-section">
                    <h3 className="modal-section-title">Synopsis</h3>
                    <p className="modal-description">{selectedMovie.description}</p>
                  </div>

                  {/* Director & Cast */}
                  <div className="modal-crew-section">
                    {selectedMovie.director && (
                      <div className="crew-item">
                        <div className="crew-label">
                          <User size={15} className="text-accent" />
                          <span>Director</span>
                        </div>
                        <span className="crew-value">{selectedMovie.director}</span>
                      </div>
                    )}

                    {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                      <div className="crew-item crew-cast-item">
                        <div className="crew-label">
                          <Users size={15} className="text-accent" />
                          <span>Starring Cast</span>
                        </div>
                        <div className="cast-chips-wrapper">
                          {selectedMovie.cast.map((actor) => (
                            <span key={actor} className="cast-chip">
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="modal-actions-bar">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      className={`btn ${isFav ? 'btn-fav-active' : 'btn-primary'}`}
                      onClick={() => toggleFavourite(selectedMovie)}
                    >
                      <Heart size={18} className={isFav ? 'fill-current text-crimson' : ''} />
                      <span>{isFav ? 'Remove from Favourites' : 'Add to Favourites'}</span>
                    </motion.button>

                    {selectedMovie.trailerUrl && (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowTrailer(!showTrailer)}
                      >
                        <Play size={16} />
                        <span>{showTrailer ? 'Hide Trailer' : 'Watch Trailer'}</span>
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      className="btn btn-ghost modal-share-btn"
                      onClick={handleShare}
                      title="Copy link to clipboard"
                    >
                      <Share2 size={16} />
                      <span>{copied ? 'Link Copied!' : 'Share'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
