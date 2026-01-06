import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import SearchFilter from '../components/SearchFilter';
import Toast from '../components/Toast';

const SmoothieMenu = () => {
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');

  const smoothieItems = useMemo(() => [
    { 
      name: 'Mango Smoothie', 
      price: 199, 
      image: '/images/mango-smoothie.jpg',
      description: 'Fresh mango blended with yogurt'
    },
    { 
      name: 'Strawberry Smoothie', 
      price: 219, 
      image: '/images/strawberry-smoothie.jpg',
      description: 'Sweet strawberries with cream'
    },
    { 
      name: 'Mixed Fruits Smoothie', 
      price: 249, 
      image: '/images/mixfruit-smoothie.jpg',
      description: 'Blend of tropical fruits'
    }
  ], []);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...smoothieItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      if (priceRange === '0-100') {
        filtered = filtered.filter(item => item.price < 100);
      } else if (priceRange === '100-200') {
        filtered = filtered.filter(item => item.price >= 100 && item.price < 200);
      } else if (priceRange === '200-300') {
        filtered = filtered.filter(item => item.price >= 200 && item.price < 300);
      } else if (priceRange === '300+') {
        filtered = filtered.filter(item => item.price >= 300);
      }
    }

    // Sort
    if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [smoothieItems, searchQuery, sortBy, priceRange]);

  const handleAddToCart = (name, price) => {
    addToCart(name, price);
    setToast({ message: `${name} added to cart!`, type: 'success' });
  };

  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: '#fff' }}>
          🥤 Smoothie Selection
        </h1>

        {/* Search and Filter */}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {/* Results Info */}
        <div style={{ 
          marginBottom: '1.5rem', 
          color: 'var(--text-gray)',
          fontSize: '0.95rem'
        }}>
          {searchQuery && (
            <p>
              Found <strong style={{ color: 'var(--primary-orange)' }}>
                {filteredAndSortedItems.length}
              </strong> result(s) for "{searchQuery}"
            </p>
          )}
          {filteredAndSortedItems.length === 0 && searchQuery && (
            <p style={{ 
              color: 'var(--text-white)', 
              fontSize: '1.1rem', 
              textAlign: 'center', 
              padding: '2rem',
              background: 'var(--dark-card)',
              borderRadius: '10px'
            }}>
              No smoothies found. Try a different search term.
            </p>
          )}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid-bordered">
          {filteredAndSortedItems.map(item => (
            <div key={item.name} className="menu-card-bordered">
              <div className="menu-card-image">
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div className="menu-card-info">
                <h3>{item.name.toUpperCase()}</h3>
                <p style={{ 
                  color: 'var(--text-gray)', 
                  fontSize: '0.9rem', 
                  marginBottom: '1rem' 
                }}>
                  {item.description}
                </p>
                <p className="price">৳{item.price}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(item.name, item.price)}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SmoothieMenu;
