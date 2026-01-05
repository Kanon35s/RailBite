import React from 'react';
import BackButton from '../components/layout/BackButton';

function About() {
  return (
    <div>
      <BackButton />
      <div className="page-hero">
        <div className="container">
          <h1>About RailBite BD</h1>
          <p>Bringing delicious food to your railway journey</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <div className="about-intro">
            <p>
              RailBite BD is Bangladesh's first railway food delivery platform, dedicated to making your train journey more enjoyable with fresh, delicious meals delivered right to your seat.
            </p>
            <p>
              We partner with trusted vendors across Bangladesh Railway stations to ensure you get authentic, hygienic, and tasty food whenever you travel.
            </p>
          </div>

          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Get your food delivered to your train seat within 30 minutes of ordering</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Quality Assured</h3>
              <p>All our partner vendors are verified and maintain strict hygiene standards</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Enjoy restaurant-quality food at affordable prices with no hidden charges</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Ordering</h3>
              <p>Simple and intuitive platform to order food in just a few clicks</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Wide Variety</h3>
              <p>Choose from hundreds of dishes including biryani, burgers, pizza, and local favorites</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Multiple payment options including bKash, Nagad, Rocket, and cash on delivery</p>
            </div>
          </div>

          <div className="mission-vision">
            <div className="mission-box">
              <h2>Our Mission</h2>
              <p>
                To revolutionize the railway travel experience in Bangladesh by providing convenient access to quality food, making every journey more comfortable and enjoyable for millions of passengers.
              </p>
            </div>

            <div className="vision-box">
              <h2>Our Vision</h2>
              <p>
                To become the leading food delivery platform for railway travelers across Bangladesh, setting new standards for convenience, quality, and customer satisfaction in the travel food industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
