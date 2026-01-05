import React, { useState } from 'react';
import BackButton from '../components/layout/BackButton';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div>
      <BackButton />
      <div className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>+880 1712-345678</p>
              <p>Mon-Sun: 6 AM - 11 PM</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email</h3>
              <p>support@railbitebd.com</p>
              <p>We reply within 24 hours</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Address</h3>
              <p>Kamalapur Railway Station</p>
              <p>Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="checkout-section" style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
            <h3>Send us a Message</h3>
            
            {submitted && (
              <div style={{ 
                background: 'rgba(76, 175, 80, 0.2)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                color: 'var(--success)',
                border: '1px solid var(--success)',
                textAlign: 'center'
              }}>
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="What is this about?"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Your message..."
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
