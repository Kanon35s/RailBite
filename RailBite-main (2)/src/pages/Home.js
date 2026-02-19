import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      navigate('/order-selection');
    } else {
      localStorage.setItem('railbiteIntendedUrl', '/order-selection');
      navigate('/login');
    }
  };

  // Popular dishes from your actual menu
  const popularDishes = [
    { 
      name: 'Bhuna Khichuri', 
      price: 350, 
      image: '/images/bhuna-khichuri.png',
      category: 'Lunch'
    },
    { 
      name: 'Beef Shwarma', 
      price: 120, 
      image: '/images/beef-shwarma.png',
      category: 'Breakfast'
    },
    { 
      name: 'Barbecue Beef Blast', 
      price: 350, 
      image: '/images/bbq-beef-blast.png',
      category: 'Snacks'
    },
    { 
      name: 'Peri Peri Pizza', 
      price: 999, 
      image: '/images/peri-peri-pizza.png',
      category: 'Lunch'
    },
    { 
      name: 'Morog Polao', 
      price: 220, 
      image: '/images/morog-polao.png',
      category: 'Dinner'
    },
    { 
      name: 'Mango Smoothie', 
      price: 199, 
      image: '/images/mango-smoothie.jpg',
      category: 'Snacks'
    },
    { 
      name: 'Beef Tehari', 
      price: 200, 
      image: '/images/beef-tehari.jpg',
      category: 'Dinner'
    },
    { 
      name: 'Dim Paratha', 
      price: 120, 
      image: '/images/paratha-dim.png',
      category: 'Breakfast'
    }
  ];

  return (
    <div>
      {/* Hero Section with Background */}
      <section className="hero-landing" style={{
        background: `linear-gradient(135deg, rgba(3, 4, 9, 0.85) 0%, rgba(3, 4, 9, 0.75) 100%), url('images/bengali-biryani.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">🚂 Bangladesh Railway Food Service</div>
          <h1 className="hero-main-title">
            Order <span className="gradient-text">Delicious Food</span><br />
            On Your Train Journey
          </h1>
          <p className="hero-description">
            Fresh, hot meals delivered right to your seat. Experience the convenience 
            of ordering authentic Bangladeshi cuisine while traveling.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
              🍽️ Get Started
            </button>
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/about')}>
              📖 Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Order food in 3 simple steps</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">🎫</div>
              <h3>1. Enter Train Details</h3>
              <p>Provide your train number, coach, and seat to help us find you easily.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">🍱</div>
              <h3>2. Choose Your Meal</h3>
              <p>Browse our menu with authentic Bangladeshi and international cuisines.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">🚀</div>
              <h3>3. Get Delivered</h3>
              <p>Fresh, hot meal delivered to your seat within 30-45 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes - From Your Actual Menu */}
      <section className="featured-menu">
        <div className="container">
          <h2 className="section-title">Popular Dishes</h2>
          <p className="section-subtitle">Our customers' favorites from your menu</p>
          
          <div className="menu-category-badges">
            <span className="category-badge">🍛 Biryani</span>
            <span className="category-badge">🌯 Shwarma</span>
            <span className="category-badge">🍕 Pizza</span>
            <span className="category-badge">🍔 Burgers</span>
          </div>

          <div className="food-grid-4">
            {popularDishes.map((dish, index) => (
              <div key={index} className="food-card">
                <div className="food-image" style={{ 
                  height: '200px', 
                  overflow: 'hidden',
                  borderRadius: '15px',
                  marginBottom: '1rem'
                }}>
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.15)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <h3>{dish.name}</h3>
                <p style={{ 
                  color: 'var(--text-gray)', 
                  fontSize: '0.85rem', 
                  marginBottom: '0.5rem' 
                }}>
                  {dish.category}
                </p>
                <p className="price">৳{dish.price}</p>
                <button className="btn btn-primary btn-sm" onClick={handleGetStarted}>
                  Order Now
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Join thousands of satisfied travelers enjoying delicious meals on the go!</p>
          <button className="btn btn-white btn-large" onClick={handleGetStarted}>
            Start Ordering Now 🚀
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;