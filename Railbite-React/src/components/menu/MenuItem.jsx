import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

function MenuItem({ name, price, image, description }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="menu-item-card">
      <div className="menu-item-image">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <span>🍽️</span>
        )}
      </div>
      <div className="menu-item-content">
        <h3 className="menu-item-title">{name}</h3>
        {description && <p className="menu-item-description">{description}</p>}
        <div className="menu-item-footer">
          <span className="menu-item-price">৳{price}</span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(name, price, image)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
