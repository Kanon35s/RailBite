import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import BackButton from './BackButton';
import Toast from './Toast';

function MenuPage({ category, title, icon }) {
  const navigate = useNavigate();
  const { fetchMenuByCategory, loading } = useMenu();
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMenuItems();
  }, [category]);

  const loadMenuItems = async () => {
    const items = await fetchMenuByCategory(category);
    setMenuItems(items);
  };

  const handleAddToCart = (item) => {
    addToCart(item.name, item.price, item.image);
    setToast({
      message: `${item.name} added to cart!`,
      type: 'success'
    });
  };

  if (loading) {
    return (
      <div className="menu-page">
        <BackButton />
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="page-header">
          <h1>{icon} {title}</h1>
          <p className="subtitle">Choose from our delicious {category} items</p>
        </div>

        {menuItems.length === 0 ? (
          <div className="empty-state">
            <p>No items available in this category</p>
          </div>
        ) : (
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-item-card">
                <div className="item-image">
                  <img 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name}
                    onError={(e) => e.target.src = '/images/placeholder.jpg'}
                  />
                  {!item.available && (
                    <div className="unavailable-badge">Unavailable</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-footer">
                    <span className="item-price">৳{item.price}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          className="btn btn-secondary view-cart-btn"
          onClick={() => navigate('/cart')}
        >
          View Cart
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default MenuPage;
