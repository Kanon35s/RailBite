import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';

const MenuCategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderType, setOrderType] = useState('Train');

  useEffect(() => {
    // Get order type from localStorage or location state
    const savedOrderType = localStorage.getItem('railbiteOrderType');
    const locationState = location.state?.orderType;
    
    if (locationState) {
      setOrderType(locationState);
      localStorage.setItem('railbiteOrderType', locationState);
    } else if (savedOrderType) {
      setOrderType(savedOrderType);
    }
  }, [location]);

  const categories = [
    {
      name: 'Breakfast',
      description: 'Start your journey fresh',
      path: '/breakfast-menu',
      image: 'images/paratha-dim.png'
    },
    {
      name: 'Lunch',
      description: 'Full meals for midday',
      path: '/lunch-menu',
      image: 'images/bhuna-khichuri.png'
    },
    {
      name: 'Snacks & Drinks',
      description: 'Quick bites & refreshments',
      path: '/snacks-menu',
      image: 'images/burger.jpg'
    },
    {
      name: 'Dinner',
      description: 'Evening delights',
      path: '/dinner-menu',
      image: 'images/beef-tehari.jpg'
    }
  ];

  return (
    <div className="category-selection-page">
      <BackButton />
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h1 className="section-title">Select Menu Category</h1>
        <p className="section-subtitle">
          Ordering from <span style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>{orderType}</span>
        </p>

        <div className="category-grid">
          {categories.map((category) => (
            <div
              key={category.name}
              className="category-card"
              onClick={() => navigate(category.path)}
              style={{
                backgroundImage: `url('${category.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden',
                height: '280px',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(3,4,9,0.5), rgba(3,4,9,0.9))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  {category.icon}
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff' }}>
                  {category.name}
                </h3>
                <p style={{ margin: 0, fontSize: '1rem', color: '#d9d9d9' }}>
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCategories;