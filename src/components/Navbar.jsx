import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Heart, Menu, X, Search, Film, Sparkles } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favouritesCount } = useFavourites();
  const location = useLocation();

  // Handle scroll effect for glassmorphic navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo with Motion Hover */}
        <Link to="/" className="brand-logo" aria-label="Stackly Home">
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            src="/favicon.webp"
            alt="Stackly"
            className="brand-logo-img"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Compass size={17} className="nav-icon" />
            <span>Explore Movies</span>
          </NavLink>

          <NavLink
            to="/favourites"
            className={({ isActive }) => `nav-link nav-link-fav ${isActive ? 'active' : ''}`}
          >
            <Heart size={17} className="nav-icon" />
            <span>Favourites</span>
            {favouritesCount > 0 && (
              <motion.span
                key={favouritesCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="fav-badge"
                aria-label={`${favouritesCount} favourite movies`}
              >
                {favouritesCount}
              </motion.span>
            )}
          </NavLink>
        </nav>

        {/* Action button */}
        <div className="navbar-actions">
          <Link
            to="/explore"
            className="navbar-search-btn"
            title="Search Movies"
            aria-label="Search movies"
          >
            <Search size={18} />
            <span className="search-hint">Quick Search...</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Portalled to document.body) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  key="mobile-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mobile-backdrop open"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-hidden="true"
                />

                <motion.div
                  key="mobile-drawer"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="mobile-drawer open"
                >
                  <div className="drawer-header">
                    <Link
                      to="/"
                      className="brand-logo"
                      aria-label="Stackly Home"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <img
                        src="/favicon.webp"
                        alt="Stackly"
                        className="brand-logo-img drawer-logo-img"
                      />
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="drawer-close-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <X size={22} />
                    </motion.button>
                  </div>

                  <nav className="mobile-nav-links">
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Film size={20} />
                      <span>Home</span>
                    </NavLink>

                    <NavLink
                      to="/explore"
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Compass size={20} />
                      <span>Explore Movies</span>
                    </NavLink>

                    <NavLink
                      to="/favourites"
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Heart size={20} />
                      <span>Favourites</span>
                      {favouritesCount > 0 && (
                        <span className="mobile-fav-badge">{favouritesCount}</span>
                      )}
                    </NavLink>
                  </nav>

                  <div className="drawer-footer">
                    <div className="drawer-tagline">
                      <Sparkles size={16} className="text-accent" />
                      <span>Premium Entertainment. Limitless Possibilities.</span>
                    </div>
                    <Link
                      to="/explore"
                      className="drawer-cta-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Search size={16} /> Browse All Movies
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
};
