import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingUp, Compass, ArrowRight, Award, Globe, Film } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';
import { MOVIES_DATA, ALL_LANGUAGES } from '../data/moviesData';

export const HomePage = () => {
  const [selectedHomeLanguage, setSelectedHomeLanguage] = useState('All');

  // Select top featured movies for Hero slider
  const featuredMovies = MOVIES_DATA.filter((m) => m.featured);

  // Filtered by selected language tab if user clicks one
  const filteredData = selectedHomeLanguage === 'All'
    ? MOVIES_DATA
    : MOVIES_DATA.filter((m) => m.language === selectedHomeLanguage);

  // Shelf 1: Trending Movies (10 items)
  const trendingMovies = filteredData.filter((m) => m.trending).slice(0, 10);

  // Shelf 2: Indian Blockbusters (Tamil, Telugu, Hindi, Malayalam, Kannada)
  const indianBlockbusters = MOVIES_DATA.filter(
    (m) => ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'].includes(m.language)
  ).slice(0, 10);

  // Shelf 3: Global Hits & Animation (Korean, English, Animation)
  const globalAndAnimation = MOVIES_DATA.filter(
    (m) => ['Animation', 'Korean', 'English'].includes(m.language)
  ).slice(0, 10);

  return (
    <div className="home-page-container">
      {/* 1. Hero Section Featuring Highlighted Movies */}
      <HeroBanner featuredMovies={featuredMovies} />

      {/* Main Content Sections */}
      <div className="home-sections-wrapper">
        {/* Quick Language Filter Pills Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="home-languages-strip"
        >
          <div className="home-lang-header">
            <Globe size={18} className="text-accent" />
            <span className="home-lang-title">Explore Cinema by Language:</span>
          </div>
          <div className="home-lang-pills">
            {ALL_LANGUAGES.map((lang) => {
              const isActive = selectedHomeLanguage === lang;
              return (
                <motion.button
                  key={lang}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className={`home-lang-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedHomeLanguage(lang)}
                >
                  <span>{lang}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Section 1: Trending Movies */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="movie-shelf-section"
        >
          <div className="shelf-header">
            <div className="shelf-title-wrap">
              <div className="shelf-icon-badge badge-flame">
                <Flame size={20} className="icon-flame" />
              </div>
              <div>
                <h2 className="shelf-title">
                  {selectedHomeLanguage === 'All' ? 'Trending This Week' : `Trending in ${selectedHomeLanguage}`}
                </h2>
                <p className="shelf-subtitle">
                  {selectedHomeLanguage === 'All'
                    ? 'The hottest movies capturing audiences worldwide across languages'
                    : `Top trending ${selectedHomeLanguage} blockbusters streaming right now`}
                </p>
              </div>
            </div>

            <Link
              to={selectedHomeLanguage === 'All' ? '/explore' : `/explore?lang=${selectedHomeLanguage}`}
              className="shelf-view-all-link"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="shelf-cards-grid">
            <AnimatePresence mode="popLayout">
              {trendingMovies.length > 0 ? (
                trendingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                <div className="shelf-empty-hint">No movies currently listed in this category.</div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Section 2: Indian Blockbusters (Tamil, Telugu, Hindi, Malayalam, Kannada) */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="movie-shelf-section"
        >
          <div className="shelf-header">
            <div className="shelf-title-wrap">
              <div className="shelf-icon-badge badge-trending">
                <TrendingUp size={20} className="icon-trending" />
              </div>
              <div>
                <h2 className="shelf-title">Indian Blockbusters</h2>
                <p className="shelf-subtitle">Spectacular cinema from Tamil, Telugu, Hindi, Malayalam & Kannada</p>
              </div>
            </div>

            <Link to="/explore?lang=Indian" className="shelf-view-all-link">
              <span>View All Indian</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="shelf-cards-grid">
            <AnimatePresence mode="popLayout">
              {indianBlockbusters.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Section 3: Global Hits, Korean Cinema & Animation */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="movie-shelf-section"
        >
          <div className="shelf-header">
            <div className="shelf-title-wrap">
              <div className="shelf-icon-badge badge-award">
                <Award size={20} className="icon-award" />
              </div>
              <div>
                <h2 className="shelf-title">Animation & Global Masterpieces</h2>
                <p className="shelf-subtitle">Critically acclaimed works from Hollywood, Korean Cinema & Cartoon Animation</p>
              </div>
            </div>

            <Link to="/explore?genre=Animation" className="shelf-view-all-link">
              <span>View All Animation</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="shelf-cards-grid">
            <AnimatePresence mode="popLayout">
              {globalAndAnimation.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="home-bottom-cta-banner"
        >
          <div className="cta-banner-content">
            <span className="cta-badge">OVER 40+ CURATED TITLES</span>
            <h3 className="cta-title">Looking for something specific?</h3>
            <p className="cta-text">
              Dive into our extensive library. Filter by Tamil, Telugu, Hindi, Malayalam, Korean, English, Kannada or Animation, search by cast or director, and sort by highest rating.
            </p>
            <Link to="/explore" className="btn btn-primary btn-large">
              <Compass size={20} />
              <span>Explore All Movies</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
