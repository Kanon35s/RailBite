import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import Toast from '../components/Toast';

const BiryaniMenu = () => {
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();

  const biryaniItems = [
    { 
      name: 'Kacchi Biryani', 
      price: 350, 
      image: '/images/biryani.jpg',
      description: 'Authentic mutton biryani'
    },
    { 
      name: 'Chicken Biryani', 
      price: 180, 
      image: '/images/chicken-biryani.jpg',
      description: 'Tender chicken with aromatic rice'
    },
    { 
      name: 'Beef Tehari', 
      price: 200, 
      image: '/images/beef-tehari.jpg',
      description: 'Spiced beef with yellow rice'
    },
    { 
      name: 'Morog Polao', 
      price: 220, 
      image: '/images/morog-polao.jpg',
      description: 'Chicken pulao with ghee'
    }
  ];

  const handleAddToCart = (name, price) => {
    addToCart(name, price);
    setToast({ message: `${name} added to cart!`, type: 'success' });
  };

  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          Biryani & Rice Selection
        </h1>

        <div className="menu-grid-bordered">
          {biryaniItems.map(item => (
            <div key={item.name} className="menu-card-bordered">
              <div className="menu-card-image">
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div className="menu-card-info">
                <h3>{item.name.toUpperCase()}</h3>
                <p style={{ 
                  color: 'var(--text-gray)', 
                  fontSize: '0.9rem', 
                  marginBottom: '1rem' 
                }}>
                  {item.description}
                </p>
                <p className="price">৳{item.price}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(item.name, item.price)}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BiryaniMenu;