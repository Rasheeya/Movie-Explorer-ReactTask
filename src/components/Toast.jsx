import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export const Toast = () => {
  const { toastMessage, dismissToast } = useFavourites();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const isRemoved = toastMessage && toastMessage.toLowerCase().includes('removed');

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast-card"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 350 }}
            className={`toast-card ${isRemoved ? 'toast-removed' : 'toast-added'}`}
          >
            <div className="toast-icon">
              {isRemoved ? (
                <Info size={18} className="toast-icon-info" />
              ) : (
                <CheckCircle2 size={18} className="toast-icon-success" />
              )}
            </div>
            <span className="toast-text">{toastMessage}</span>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={dismissToast}
              className="toast-close"
              aria-label="Close notification"
            >
              <X size={15} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
