import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Compass, Film } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo" aria-label="Stackly Home">
              <img
                src="/favicon.webp"
                alt="Stackly"
                className="brand-logo-img footer-logo-img"
              />
            </Link>
            <p className="footer-description">
              Your ultimate entertainment destination for blockbuster movies, trending cinema, and timeless masterpieces. Curate your personal watchlist and stream limitless possibilities.
            </p>
            <div className="footer-badges">
              <span className="badge-tag">React 18</span>
              <span className="badge-tag">React Router v6</span>
              <span className="badge-tag">JioHotstar Palette</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home Spotlight</Link>
              </li>
              <li>
                <Link to="/explore">Explore All Movies</Link>
              </li>
              <li>
                <Link to="/favourites">My Watchlist</Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div className="footer-nav-col">
            <h4 className="footer-title">Top Genres</h4>
            <ul className="footer-links">
              <li>
                <Link to="/explore?genre=Action">Action & Adventure</Link>
              </li>
              <li>
                <Link to="/explore?genre=Sci-Fi">Sci-Fi & Cyberpunk</Link>
              </li>
              <li>
                <Link to="/explore?genre=Drama">Drama & Cinema</Link>
              </li>
              <li>
                <Link to="/explore?genre=Animation">Animation & Family</Link>
              </li>
            </ul>
          </div>

          {/* Inspiration */}
          <div className="footer-nav-col">
            <h4 className="footer-title">Premium Experience</h4>
            <p className="footer-inspiration-text">
              Crafted with a sleek JioHotstar-inspired cinematic palette. Dynamic movie cards, LocalStorage watchlist, instant multi-filter search, and mobile responsiveness.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Stackly Movie Explorer. Built with React & modern CSS.
          </p>
          <div className="footer-bottom-tag">
            <span>Premium Entertainment. Limitless Possibilities.</span>
            <Heart size={14} className="text-crimson fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
