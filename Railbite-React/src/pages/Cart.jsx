import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import BackButton from '../components/layout/BackButton';

function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <div className="cart-page">
      <BackButton />
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <Link to="/menu-categories" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
