import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getSubtotal, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const vat = Math.round(subtotal * 0.05);
  const deliveryFee = 50;
  const total = getTotal();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <BackButton />
        <div className="container">
          <div className="cart-header">
            <h1>Your Cart</h1>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/menu-categories')}
            >
              Start Ordering
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <BackButton />
      <div className="container">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>

        <div className="cart-container">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">{item.image || '🍽️'}</div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
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
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>VAT (5%)</span>
              <span>৳{vat}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div className="summary-row">
              <span><strong>Total</strong></span>
              <span><strong>৳{total}</strong></span>
            </div>
            <button 
              className="btn btn-primary btn-block"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <button 
              className="btn btn-secondary btn-block"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/menu-categories')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;