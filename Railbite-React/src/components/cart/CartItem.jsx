import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-item">
      <div className="item-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <span>🍽️</span>
        )}
      </div>
      <div className="item-details">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-price">৳{item.price}</p>
        <div className="item-quantity">
          <button 
            className="qty-btn" 
            onClick={() => updateQuantity(item.id, -1)}
          >
            -
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button 
            className="qty-btn" 
            onClick={() => updateQuantity(item.id, 1)}
          >
            +
          </button>
        </div>
      </div>
      <button 
        className="remove-btn" 
        onClick={() => removeFromCart(item.id)}
      >
        🗑️
      </button>
    </div>
  );
}

export default CartItem;
