import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="container">
          <div className="hero-badge">🚂 Bangladesh Railway's Official Food Partner</div>
          <h1 className="hero-main-title">
            Delicious Food<br />
            <span className="gradient-text">Right to Your Seat</span>
          </h1>
          <p className="hero-description">
            Order authentic Bangladeshi cuisine while traveling on Bangladesh Railway. 
            Fresh, hot meals delivered right to your train seat or pick up from railway stations.
          </p>
          <div className="hero-buttons">
            <Link to="/order-selection" className="btn btn-primary btn-large">
              Start Ordering Now
            </Link>
            <Link to="/menu-categories" className="btn btn-secondary btn-large">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to enjoy delicious meals during your journey</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">🚂</div>
              <h3>Order from Train</h3>
              <p>Traveling on a train? Enter your PNR number, select your seat, and choose from our delicious menu. Food will be delivered right to your seat.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">🏢</div>
              <h3>Order from Station</h3>
              <p>At a railway station? Select your station and pick a nearby vendor. Order ahead and collect fresh food when you arrive.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">💳</div>
              <h3>Pay & Enjoy</h3>
              <p>Choose from multiple payment options including bKash, Nagad, and Rocket. Your order will be prepared fresh and delivered on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="featured-menu">
        <div className="container">
          <h2 className="section-title">Featured Menu</h2>
          <p className="section-subtitle">Popular dishes loved by our travelers</p>
          
          <div className="menu-category-badges">
            <span className="category-badge">🍛 Biryani</span>
            <span className="category-badge">🍔 Burgers</span>
            <span className="category-badge">🍕 Pizza</span>
            <span className="category-badge">🌯 Shwarma</span>
          </div>

          <div className="food-grid-4">
            <div className="food-card">
              <div className="food-image">
                <img src="/images/bengali_biryani.jpg" alt="Biryani" />
              </div>
              <h3>Bengali Biryani</h3>
              <p className="price">৳250</p>
              <Link to="/menu/biryani" className="btn btn-primary">Order Now</Link>
            </div>

            <div className="food-card">
              <div className="food-image">
                <img src="/images/classic-king.jpg" alt="Burger" />
              </div>
              <h3>Classic King Burger</h3>
              <p className="price">৳180</p>
              <Link to="/menu/burger" className="btn btn-primary">Order Now</Link>
            </div>

            <div className="food-card">
              <div className="food-image">
                <img src="/images/beef-pepparoni.jpg" alt="Pizza" />
              </div>
              <h3>Beef Pepperoni Pizza</h3>
              <p className="price">৳450</p>
              <Link to="/menu/pizza" className="btn btn-primary">Order Now</Link>
            </div>

            <div className="food-card">
              <div className="food-image">
                <img src="/images/chicken-shwarma.jpg" alt="Shwarma" />
              </div>
              <h3>Chicken Shwarma</h3>
              <p className="price">৳120</p>
              <Link to="/menu/shwarma" className="btn btn-primary">Order Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Join thousands of travelers enjoying delicious meals on Bangladesh Railway</p>
          <Link to="/order-selection" className="btn btn-white btn-large">
            Start Ordering Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
