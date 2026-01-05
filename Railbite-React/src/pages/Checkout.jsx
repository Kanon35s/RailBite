import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import BackButton from '../components/layout/BackButton';

function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    transactionId: ''
  });

  const subtotal = getCartTotal();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store order details
    const orderDetails = {
      items: cart,
      total: total,
      paymentMethod: paymentMethod,
      customerInfo: formData,
      orderDate: new Date().toISOString(),
      orderId: 'ORD-' + Date.now()
    };
    
    localStorage.setItem('railbiteOrder', JSON.stringify(orderDetails));
    clearCart();
    navigate('/order-success');
  };

  return (
    <div className="checkout-page">
      <BackButton />
      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: 'var(--text-white)' }}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="checkout-container">
            <div>
              {/* Customer Information */}
              <div className="checkout-section">
                <h3>Customer Information</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+880 1712-345678"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Delivery Address *</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your complete address"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <div 
                    className={`payment-method ${paymentMethod === 'bkash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('bkash')}
                  >
                    <div className="payment-method-icon">💳</div>
                    <h4>bKash</h4>
                    <p>Mobile Payment</p>
                  </div>

                  <div 
                    className={`payment-method ${paymentMethod === 'nagad' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('nagad')}
                  >
                    <div className="payment-method-icon">📱</div>
                    <h4>Nagad</h4>
                    <p>Mobile Payment</p>
                  </div>

                  <div 
                    className={`payment-method ${paymentMethod === 'rocket' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('rocket')}
                  >
                    <div className="payment-method-icon">🚀</div>
                    <h4>Rocket</h4>
                    <p>Mobile Payment</p>
                  </div>

                  <div 
                    className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-method-icon">💵</div>
                    <h4>Cash on Delivery</h4>
                    <p>Pay at delivery</p>
                  </div>
                </div>

                {paymentMethod && paymentMethod !== 'cod' && (
                  <div className="payment-details">
                    <h4>Payment Instructions</h4>
                    <p>1. Open your mobile banking app ({paymentMethod})</p>
                    <p>2. Send <strong>৳{total}</strong> to our merchant</p>
                    <p>3. Enter the transaction ID below</p>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label>Transaction ID *</label>
                      <input 
                        type="text"
                        required={paymentMethod !== 'cod'}
                        value={formData.transactionId}
                        onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                        placeholder="Enter transaction ID"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="payment-details">
                    <h4>Cash on Delivery</h4>
                    <p>Please keep exact change ready. Our delivery partner will collect <strong>৳{total}</strong> when your food arrives at your seat.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-section">
              <h3>Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="summary-row">
                  <span>{item.name} x {item.quantity}</span>
                  <span>৳{item.price * item.quantity}</span>
                </div>
              ))}
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
                <strong>৳{total}</strong>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={!paymentMethod}
              >
                Place Order
              </button>
              <div className="security-note">
                <span>🔒</span>
                <span>Secure checkout - Your information is protected</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
