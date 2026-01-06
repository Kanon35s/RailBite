import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Toast from '../components/Toast';

const Contact = () => {
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Thank you! We will contact you soon.', type: 'success' });
    e.target.reset();
  };

  return (
    <div>
      <BackButton />

      {/* Contact Page */}
      <div className="contact-content">
        <div className="container">
          <h1 className="section-title">Contact Us</h1>
          
          <div className="about-intro">
            <p>
              Have questions or need assistance? Our customer support team is here to help you 24/7. 
              Reach out to us through any of the following channels.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Support</h3>
              <p>Call us anytime</p>
              <p className="contact-value">+880 1XXX-XXXXXX</p>
              <p className="contact-value">+880 2-XXXXXXX</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>Write to us</p>
              <p className="contact-value">support@railbitebd.com</p>
              <p className="contact-value">info@railbitebd.com</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🏢</div>
              <h3>Head Office</h3>
              <p>Visit us at</p>
              <p className="contact-value">Kamalapur Railway Station</p>
              <p className="contact-value">Dhaka-1217, Bangladesh</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">⏰</div>
              <h3>Working Hours</h3>
              <p>We're available</p>
              <p className="contact-value">24/7 Customer Support</p>
              <p className="contact-value">Including holidays</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
              <h3>How do I track my order?</h3>
              <p>
                You will receive a confirmation SMS and email with your order number. You can use 
                this to track your order status.
              </p>
            </div>

            <div className="faq-item">
              <h3>What if my train gets delayed?</h3>
              <p>
                Our system automatically adjusts delivery timing based on live train schedules. You 
                can also call our support team to update your delivery time.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I cancel my order?</h3>
              <p>
                Yes, you can cancel your order up to 30 minutes before the scheduled delivery time. 
                Contact our customer support for cancellations.
              </p>
            </div>

            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>
                We accept cash on delivery, card payments, and mobile banking (bKash, Nagad, Rocket).
              </p>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Contact;