import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

function Toast() {
  const { toast } = useContext(CartContext);

  if (!toast.show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: 'var(--primary-orange)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '10px',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease'
    }}>
      {toast.message}
    </div>
  );
}

export default Toast;
