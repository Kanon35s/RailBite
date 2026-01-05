import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';

function MenuCategories() {
  const navigate = useNavigate();

  const categories = [
    { icon: '🍛', name: 'Biryani', path: '/menu/biryani', description: '15+ items' },
    { icon: '🍔', name: 'Burgers', path: '/menu/burger', description: '12+ items' },
    { icon: '🍕', name: 'Pizza', path: '/menu/pizza', description: '20+ items' },
    { icon: '🌯', name: 'Shwarma', path: '/menu/shwarma', description: '8+ items' },
    { icon: '🍳', name: 'Breakfast', path: '/menu/breakfast', description: '10+ items' },
    { icon: '🍱', name: 'Lunch', path: '/menu/lunch', description: '18+ items' },
    { icon: '🍽️', name: 'Dinner', path: '/menu/dinner', description: '22+ items' },
    { icon: '🥤', name: 'Drinks', path: '/menu/drinks', description: '15+ items' },
    { icon: '🥤', name: 'Smoothies', path: '/menu/smoothie', description: '12+ items' },
    { icon: '🍿', name: 'Snacks', path: '/menu/snacks', description: '10+ items' }
  ];

  return (
    <div className="category-selection-page">
      <BackButton />
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-white)' }}>
          Browse Menu Categories
        </h1>
        <p style={{ color: 'var(--text-gray)', marginBottom: '3rem', textAlign: 'center' }}>
          Select a category to explore our delicious offerings
        </p>

        <div className="category-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              onClick={() => navigate(category.path)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuCategories;
