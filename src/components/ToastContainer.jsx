import React, { useState, useEffect } from 'react';
import { subscribeToToasts } from '../utils/toast';
import './ToastContainer.css';

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prevToasts) => [...prevToasts, toast]);

      // Auto-remove after 3.5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id));
      }, 3500);
    });

    return unsubscribe;
  }, []);

  const handleRemove = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} ${toast.removing ? 'toast-out' : ''}`}
          onAnimationEnd={() => {
            if (toast.removing) {
              handleRemove(toast.id);
            }
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}