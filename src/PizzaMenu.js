import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import SearchFilter from '../components/SearchFilter';
import Toast from '../components/Toast';

const PizzaMenu = () => {
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');

  const pizzaItems = useMemo(() => [
    { 
      name: 'Peri Peri Chicken Pizza', 
      price: 999, 
      image: '/images/peri-peri-pizza.png',
      description: 'Spicy chicken with peri peri sauce'
    },
    { 
      name: 'Beef Pepperoni Pizza', 
      price: 899, 
      image: '/images/beef-pepperoni.jpg',
      description: 'Classic pepperoni with mozzarella'
    },
    { 
      name: 'Mozzarella Cheese Mushroom Pizza', 
      price: 799, 
      image: '/images/mozarella-cheese.jpg',
      description: 'Cheesy mushroom delight'
    },
    { 
      name: 'Vegetable Pizza', 
      price: 699, 
      image: '/images/vegetable-pizza.jpg',
      description: 'Fresh vegetables with herbs'
    }
  ], []);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...pizzaItems];

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
  }, [pizzaItems, searchQuery, sortBy, priceRange]);

  const handleAddToCart = (name, price) => {
    addToCart(name, price);
    setToast({ message: `${name} added to cart!`, type: 'success' });
  };

  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: '#fff' }}>
          🍕 Pizza Selection
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
              No pizzas found. Try a different search term.
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

export default PizzaMenu;
