import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Film, SlidersHorizontal, Sparkles } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { MovieGrid } from '../components/MovieGrid';
import { MOVIES_DATA } from '../data/moviesData';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params if present
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'All';
  const initialLang = searchParams.get('lang') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);
  const [selectedSort, setSelectedSort] = useState('rating-desc');
  const [selectedYear, setSelectedYear] = useState('all');

  // Synchronize URL parameters if changed from outside
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlGenre = searchParams.get('genre');
    const urlLang = searchParams.get('lang');
    if (urlSearch !== null && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
    if (urlGenre !== null && urlGenre !== selectedGenre) {
      setSelectedGenre(urlGenre);
    }
    if (urlLang !== null && urlLang !== selectedLanguage) {
      setSelectedLanguage(urlLang);
    }
  }, [searchParams]);

  // Check if any filter is active
  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedGenre !== 'All' ||
      selectedLanguage !== 'All' ||
      selectedSort !== 'rating-desc' ||
      selectedYear !== 'all'
    );
  }, [searchQuery, selectedGenre, selectedLanguage, selectedSort, selectedYear]);

  // Handle Clear Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedSort('rating-desc');
    setSelectedYear('all');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...MOVIES_DATA];

    // 1. Search Query Filter (Title, Director, Cast, or Language)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((movie) => {
        const titleMatch = movie.title.toLowerCase().includes(q);
        const directorMatch = movie.director ? movie.director.toLowerCase().includes(q) : false;
        const castMatch = movie.cast ? movie.cast.some((actor) => actor.toLowerCase().includes(q)) : false;
        const langMatch = movie.language ? movie.language.toLowerCase().includes(q) : false;
        return titleMatch || directorMatch || castMatch || langMatch;
      });
    }

    // 2. Language Filter
    if (selectedLanguage !== 'All') {
      if (selectedLanguage === 'Indian') {
        result = result.filter((m) =>
          ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'].includes(m.language)
        );
      } else {
        result = result.filter((m) => m.language === selectedLanguage);
      }
    }

    // 3. Genre Filter
    if (selectedGenre !== 'All') {
      result = result.filter((movie) =>
        movie.genres && movie.genres.includes(selectedGenre)
      );
    }

    // 4. Year Filter
    if (selectedYear !== 'all') {
      result = result.filter((movie) => {
        const y = movie.year;
        if (selectedYear === '2024') return y === 2024;
        if (selectedYear === '2023') return y === 2023;
        if (selectedYear === '2022') return y === 2022;
        if (selectedYear === '2020s') return y >= 2020;
        if (selectedYear === '2010s') return y >= 2010 && y <= 2019;
        if (selectedYear === 'classic') return y < 2010;
        return true;
      });
    }

    // 5. Sorting
    switch (selectedSort) {
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedGenre, selectedLanguage, selectedYear, selectedSort]);

  return (
    <div className="explore-page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="explore-header"
      >
        <div className="explore-header-content">
          <div className="explore-tag-badge">
            <Sparkles size={14} className="text-accent" />
            <span>MULTILINGUAL CATALOG ({MOVIES_DATA.length} TITLES)</span>
          </div>
          <h1 className="explore-main-title">Explore Cinema</h1>
          <p className="explore-description">
            Discover masterpieces in Tamil, Telugu, Hindi, Malayalam, Kannada, Korean, English and Animation. Search titles, actors, or filter by genres and release eras.
          </p>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onClearFilters={handleClearFilters}
        totalResults={filteredAndSortedMovies.length}
        isFiltered={isFiltered}
      />

      {/* Results Meta Info */}
      <motion.div
        layout
        className="explore-results-meta"
      >
        <div className="results-count-wrapper">
          <SlidersHorizontal size={16} className="text-accent" />
          <span className="results-count-text">
            Showing <strong>{filteredAndSortedMovies.length}</strong> of{' '}
            <strong>{MOVIES_DATA.length}</strong> movies
            {selectedLanguage !== 'All' && <span> in <strong>{selectedLanguage}</strong></span>}
            {selectedGenre !== 'All' && <span> · <strong>{selectedGenre}</strong></span>}
          </span>
        </div>
      </motion.div>

      {/* Dynamic Movie Grid */}
      <MovieGrid
        movies={filteredAndSortedMovies}
        emptyMessage="Try adjusting your search terms, changing the language filter, or clearing filters to see more titles."
        onReset={handleClearFilters}
      />
    </div>
  );
};
