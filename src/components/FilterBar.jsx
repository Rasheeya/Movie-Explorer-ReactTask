import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, RotateCcw, Calendar, ArrowUpDown, Globe, Film } from 'lucide-react';
import { ALL_GENRES, ALL_LANGUAGES, SORT_OPTIONS, YEAR_OPTIONS } from '../data/moviesData';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedLanguage,
  onLanguageChange,
  selectedSort,
  onSortChange,
  selectedYear,
  onYearChange,
  onClearFilters,
  totalResults,
  isFiltered
}) => {
  return (
    <div className="filter-bar-wrapper">
      {/* Search Input Row */}
      <div className="filter-search-row">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, director, or actor in any language..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search movies"
          />
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search text"
            >
              <X size={16} />
            </motion.button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="select-container sort-container">
          <ArrowUpDown size={16} className="select-icon" />
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
            aria-label="Sort movies"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Release Year Dropdown */}
        <div className="select-container year-container">
          <Calendar size={16} className="select-icon" />
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="filter-select"
            aria-label="Filter by release year"
          >
            {YEAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Year: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="btn-clear-filters"
            onClick={onClearFilters}
            title="Reset all search, language, genre, sort and year filters"
            aria-label="Clear all filters"
          >
            <RotateCcw size={15} />
            <span>Clear Filters</span>
          </motion.button>
        )}
      </div>

      {/* Language / Industry Category Row */}
      <div className="filter-language-row">
        <div className="filter-row-header">
          <Globe size={15} className="text-accent" />
          <span className="filter-row-label">Language & Industry:</span>
        </div>
        <div className="language-pills-container">
          {ALL_LANGUAGES.map((lang) => {
            const isActive = selectedLanguage === lang;
            return (
              <motion.button
                key={lang}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={`language-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onLanguageChange(lang)}
                aria-pressed={isActive}
              >
                <span>{lang}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Genre Pills Row */}
      <div className="filter-genres-row">
        <div className="filter-row-header">
          <Film size={15} className="text-accent" />
          <span className="filter-row-label">Genres:</span>
        </div>
        <div className="genres-scroll-container">
          {ALL_GENRES.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={`genre-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onGenreChange(genre)}
                aria-pressed={isActive}
              >
                <span>{genre}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
