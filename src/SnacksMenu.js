import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import SearchFilter from '../components/SearchFilter';
import Toast from '../components/Toast';

const SnacksMenu = () => {
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');

  const snacksItems = useMemo(() => [
    { 
      name: 'Burger', 
      price: 250, 
      image: '/images/burger.jpg',
      description: 'Explore different types',
      hasSubmenu: true,
      path: '/burger-menu'
    },
    { 
      name: 'Jhal Muri', 
      price: 30, 
      image: '/images/jhalmuri.png',
      description: 'Spicy puffed rice mix',
      hasSubmenu: false
    },
    { 
      name: 'Smoothie', 
      price: 199, 
      image: '/images/smoothie.jpg',
      description: 'Explore different flavors',
      hasSubmenu: true,
      path: '/smoothie-menu'
    },
    { 
      name: 'Beverage', 
      price: 50, 
      image: '/images/drinks.jpg',
      description: 'Soft drinks & more',
      hasSubmenu: true,
      path: '/beverage-menu'
    }
  ], []);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...snacksItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter (skip items with hasSubmenu for price filtering)
    if (priceRange !== 'all') {
      if (priceRange === '0-100') {
        filtered = filtered.filter(item => item.hasSubmenu || item.price < 100);
      } else if (priceRange === '100-200') {
        filtered = filtered.filter(item => item.hasSubmenu || (item.price >= 100 && item.price < 200));
      } else if (priceRange === '200-300') {
        filtered = filtered.filter(item => item.hasSubmenu || (item.price >= 200 && item.price < 300));
      } else if (priceRange === '300+') {
        filtered = filtered.filter(item => item.hasSubmenu || item.price >= 300);
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
  }, [snacksItems, searchQuery, sortBy, priceRange]);

  const handleItemClick = (item) => {
    if (item.hasSubmenu) {
      navigate(item.path);
    } else {
      addToCart(item.name, item.price);
      setToast({ message: `${item.name} added to cart!`, type: 'success' });
    }
  };

  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍟 Snacks & Drinks Menu</h1>
          <p className="ordering-from">Ordering from <span>Train</span></p>
        </div>

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
              No items found. Try a different search term.
            </p>
          )}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredAndSortedItems.map(item => (
            <div key={item.name} className="menu-item-card">
              <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="menu-item-content">
                <h3 className="menu-item-title">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <div className="menu-item-footer">
                  {!item.hasSubmenu && (
                    <span className="menu-item-price">৳{item.price}</span>
                  )}
                  <button 
                    className={`btn ${item.hasSubmenu ? 'btn-explore' : 'btn-primary'} btn-sm`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.hasSubmenu ? 'Explore →' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SnacksMenu;
