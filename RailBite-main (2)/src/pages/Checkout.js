import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import BackButton from '../components/BackButton';
import Toast from '../components/Toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder, orderType, bookingDetails } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState('cash');

 const [contactInfo, setContactInfo] = useState({
  fullName: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || ''   
});


  const [mobileBankingInfo, setMobileBankingInfo] = useState({
    provider: '',
    transactionId: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  useEffect(() => {
  if (user) {
    setContactInfo(prev => ({
      ...prev,
      fullName: user.name || prev.fullName,
      email: user.email || prev.email,
      phone: user.phone || prev.phone
    }));
  }
}, [user]);


  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };


  const hideToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.05;
  };

  const calculateDeliveryFee = () => {
    return 50;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT() + calculateDeliveryFee();
  };

  const handleContactChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleMobileBankingChange = (e) => {
    setMobileBankingInfo({
      ...mobileBankingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCardInfoChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }

    setCardInfo({
      ...cardInfo,
      [name]: value
    });
  };

  const validateContactInfo = () => {
    if (!contactInfo.fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return false;
    }
    if (!contactInfo.email.trim()) {
      showToast('Please enter your email', 'error');
      return false;
    }
    if (!contactInfo.phone.trim()) {
      showToast('Please enter your phone number', 'error');
      return false;
    }
    return true;
  };

  const validateMobileBanking = () => {
    if (!mobileBankingInfo.provider) {
      showToast('Please select a mobile banking provider', 'error');
      return false;
    }
    if (!mobileBankingInfo.transactionId.trim()) {
      showToast('Please enter transaction ID', 'error');
      return false;
    }
    if (mobileBankingInfo.transactionId.length < 8) {
      showToast('Transaction ID must be at least 8 characters', 'error');
      return false;
    }
    return true;
  };

  const validateCardPayment = () => {
    const cardNumberDigits = cardInfo.cardNumber.replace(/\s/g, '');

    if (!cardInfo.cardNumber.trim()) {
      showToast('Please enter card number', 'error');
      return false;
    }
    if (cardNumberDigits.length !== 16) {
      showToast('Card number must be 16 digits', 'error');
      return false;
    }
    if (!cardInfo.cardholderName.trim()) {
      showToast('Please enter cardholder name', 'error');
      return false;
    }
    if (!cardInfo.expiryDate.trim() || cardInfo.expiryDate.length !== 5) {
      showToast('Please enter valid expiry date (MM/YY)', 'error');
      return false;
    }

    const [month, year] = cardInfo.expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    if (expiry < today) {
      showToast('Card has expired', 'error');
      return false;
    }

    if (!cardInfo.cvv.trim() || cardInfo.cvv.length !== 3) {
      showToast('Please enter valid 3-digit CVV', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateContactInfo()) {
      return;
    }

    if (paymentMethod === 'mobile') {
      if (!validateMobileBanking()) {
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!validateCardPayment()) {
        return;
      }
    }

    const subtotal = calculateSubtotal();
    const vat = calculateVAT();
    const deliveryFee = calculateDeliveryFee();
    const total = calculateTotal();

    const token = localStorage.getItem('railbiteToken');
    if (!token) {
      showToast('You must be logged in to place an order', 'error');
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      contactInfo: {
        fullName: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone
      },
      orderType: orderType || bookingDetails?.orderType || 'train',
      bookingDetails: bookingDetails
        ? {
            passengerName: bookingDetails.passengerName,
            phone: bookingDetails.phone,
            trainNumber: bookingDetails.trainNumber,
            coachNumber: bookingDetails.coachNumber,
            seatNumber: bookingDetails.seatNumber,
            pickupStation: bookingDetails.pickupStation
          }
        : null,
      paymentMethod,
      paymentInfo:
        paymentMethod === 'mobile'
          ? {
              provider: mobileBankingInfo.provider,
              transactionId: mobileBankingInfo.transactionId
            }
          : paymentMethod === 'card'
          ? {
              cardLastFour: cardInfo.cardNumber.replace(/\s/g, '').slice(-4),
              cardholderName: cardInfo.cardholderName
            }
          : {},
      subtotal,
      vat,
      deliveryFee,
      total
    };

    try {
      const res = await axios.post(`${API_URL}/orders`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        const created = res.data.data;
        addOrder(created);
        clearCart();
        navigate('/order-success', { state: { orderId: created.orderId } });
      } else {
        showToast(res.data.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to place order',
        'error'
      );
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <BackButton />
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#fff'
          }}
        >
          Checkout
        </h1>

        <div className="checkout-container">
          <div>
            {/* Contact Information */}
            <div className="checkout-section">
              <h3>Contact Information</h3>
              <form id="checkoutForm" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={contactInfo.fullName}
                      onChange={handleContactChange}
                      placeholder="John Doe"
                      required
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      placeholder="john@example.com"
                      required
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactChange}
                    placeholder="01712345678"
                    required
                    readOnly
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <div
                  className={`payment-method ${
                    paymentMethod === 'mobile' ? 'active' : ''
                  }`}
                  onClick={() => setPaymentMethod('mobile')}
                >
                  <div className="payment-method-icon">💳</div>
                  <h4>Mobile Banking</h4>
                  <p>bKash, Nagad, Rocket</p>
                </div>

                <div
                  className={`payment-method ${
                    paymentMethod === 'card' ? 'active' : ''
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-method-icon">💳</div>
                  <h4>Card Payment</h4>
                  <p>Debit/Credit Card</p>
                </div>

                <div
                  className={`payment-method ${
                    paymentMethod === 'cash' ? 'active' : ''
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="payment-method-icon">💵</div>
                  <h4>Cash on Delivery</h4>
                  <p>Pay on arrival</p>
                </div>
              </div>

              {/* Payment Details */}
              <div id="paymentDetails" className="payment-details">
                {paymentMethod === 'cash' && (
                  <div>
                    <h4>Cash on Delivery</h4>
                    <p>
                      Please keep exact change ready. Our delivery partner will
                      collect <strong>৳{calculateTotal().toFixed(2)}</strong>{' '}
                      when your food arrives.
                    </p>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div>
                    <h4>Mobile Banking Payment</h4>
                    <div className="form-group">
                      <label>Select Provider</label>
                      <select
                        name="provider"
                        value={mobileBankingInfo.provider}
                        onChange={handleMobileBankingChange}
                        required
                      >
                        <option value="">Choose Provider</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                        <option value="upay">Upay</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        Transaction ID{' '}
                        <span style={{ color: '#ff6b6b' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        placeholder="Enter transaction ID"
                        value={mobileBankingInfo.transactionId}
                        onChange={handleMobileBankingChange}
                        required
                      />
                      <small
                        style={{
                          color: '#b0b0b0',
                          fontSize: '0.875rem'
                        }}
                      >
                        Please complete the payment first and enter the
                        transaction ID here
                      </small>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div>
                    <h4>Card Payment Details</h4>
                    <div className="form-group">
                      <label>
                        Card Number{' '}
                        <span style={{ color: '#ff6b6b' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInfoChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Cardholder Name{' '}
                        <span style={{ color: '#ff6b6b' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        placeholder="John Doe"
                        value={cardInfo.cardholderName}
                        onChange={handleCardInfoChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          Expiry Date{' '}
                          <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={handleCardInfoChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          CVV <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          maxLength="3"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="security-note">
                🔒 Your payment information is secure and encrypted
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div id="checkoutItems">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span id="subtotal">৳{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>VAT (5%)</span>
              <span id="vat">৳{calculateVAT().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span id="deliveryFee">৳{calculateDeliveryFee().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>
                <strong>Total</strong>
              </span>
              <span id="total">
                <strong>৳{calculateTotal().toFixed(2)}</strong>
              </span>
            </div>

            <button
              form="checkoutForm"
              type="submit"
              className="btn btn-primary btn-block"
            >
              Place Order
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="btn btn-secondary btn-block"
              style={{ marginTop: '1rem' }}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Checkout;
