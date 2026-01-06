import React from 'react';
import BackButton from '../components/BackButton';

const About = () => {
  return (
    <div>
      <BackButton />

      {/* About Page */}
      <div className="about-content">
        <div className="container">
          <h1 className="section-title">About Us</h1>
          
          <div className="about-intro">
            <p>
              Bangladesh Railway's premier food delivery service. We bring authentic Bangladeshi 
              cuisine directly to your train seat, making your journey more comfortable and enjoyable.
            </p>
            <p>
              Founded with a vision to revolutionize railway food service, we partner with trusted 
              restaurants and onboard kitchens to deliver fresh, hygienic, and delicious meals to 
              passengers across Bangladesh.
            </p>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌏</div>
              <h3>Nationwide Coverage</h3>
              <p>
                Serving passengers on all major routes including Dhaka-Chittagong, Dhaka-Sylhet, 
                and Dhaka-Rajshahi.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Quality Assured</h3>
              <p>
                All our partner restaurants are verified and maintain the highest standards of 
                food safety and hygiene.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Timely Delivery</h3>
              <p>
                We ensure your food reaches you fresh and on time, coordinated with your train schedule.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Customer First</h3>
              <p>
                Our dedicated support team is available 24/7 to assist you with your orders and queries.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mission-vision">
            <div className="mission-box">
              <h2>Our Mission</h2>
              <p>
                To transform the railway dining experience by providing convenient, affordable, and 
                high-quality food delivery services to passengers throughout Bangladesh, celebrating 
                our rich culinary heritage.
              </p>
            </div>

            <div className="vision-box">
              <h2>Our Vision</h2>
              <p>
                To become Bangladesh's most trusted railway food service, setting new standards in 
                hygiene, taste, and customer satisfaction, while supporting local businesses and 
                traditional cuisine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;