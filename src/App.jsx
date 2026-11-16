import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MovieModal } from './components/MovieModal';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { FavouritesPage } from './pages/FavouritesPage';
import { Film, Home, Compass } from 'lucide-react';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// 404 Not Found Page Component
const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <Film size={64} className="not-found-icon" />
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Scene Not Found</h2>
        <p className="not-found-text">
          The page you are looking for doesn't exist or has been moved to another reel.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          <Link to="/explore" className="btn btn-secondary">
            <Compass size={18} />
            <span>Explore Movies</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <FavouritesProvider>
        <div className="app-shell">
          <ScrollToTop />
          <Navbar />
          
          <div className="main-content-area">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          <Footer />

          {/* Global Movie Details Modal */}
          <MovieModal />

          {/* Global Toast Notification */}
          <Toast />
        </div>
      </FavouritesProvider>
    </Router>
  );
};

export default App;
