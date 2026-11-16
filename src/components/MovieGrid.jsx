import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { Film, RotateCcw } from 'lucide-react';

export const MovieGrid = ({ movies, emptyMessage, onReset }) => {
  if (!movies || movies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="empty-state-box"
      >
        <div className="empty-icon-wrap">
          <Film size={48} className="empty-icon" />
        </div>
        <h3 className="empty-title">No Movies Found</h3>
        <p className="empty-description">
          {emptyMessage || "We couldn't find any movies matching your current search or filter criteria."}
        </p>
        {onReset && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="empty-cta-btn"
          >
            <RotateCcw size={16} />
            <span>Reset Filters</span>
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="movie-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
