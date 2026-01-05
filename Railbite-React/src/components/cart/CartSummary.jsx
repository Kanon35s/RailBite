import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

function CartSummary() {
  const { cart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>৳{subtotal}</span>
      </div>
      <div className="summary-row">
        <span>Delivery Fee:</span>
        <span>৳{deliveryFee}</span>
      </div>
      <div className="summary-row">
        <strong>Total:</strong>
        <strong id="total">৳{total}</strong>
      </div>
      <button 
        className="btn btn-primary btn-block"
        onClick={() => navigate('/checkout')}
        disabled={cart.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default CartSummary;
