import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import SearchFilter from '../components/SearchFilter';
import Toast from '../components/Toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const LunchMenu = () => {
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [backendItems, setBackendItems] = useState(null);
  const [loading, setLoading] = useState(false);

  const staticItems = useMemo(
    () => [
      {
        name: 'Bhuna Khichuri with Chicken',
        price: 200,
        image: '/images/bhuna-khichuri.png',
        description: 'Rich and flavorful rice dish',
        hasSubmenu: false,
      },
      {
        name: 'Morog Polao',
        price: 220,
        image: '/images/morog-polao.png',
        description: 'Chicken pulao with ghee',
        hasSubmenu: false,
      },
      {
        name: 'Beef Kala Bhuna',
        price: 280,
        image: '/images/beef-kalabhuna.png',
        description: 'Slow-cooked spicy beef curry',
        hasSubmenu: false,
      },
      {
        name: 'Fish Curry with Rice',
        price: 180,
        image: '/images/fishcurry.jpg',
        description: 'Traditional Bengali fish curry',
        hasSubmenu: false,
      },
      {
        name: 'Pizza',
        price: 0,
        image: '/images/pizza.jpg',
        description: 'Explore different types',
        hasSubmenu: true,
        path: '/pizza-menu',
      },
    ],
    []
  );

  useEffect(() => {
    const fetchLunch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/menu`, {
          params: { category: 'lunch' },
        });
        if (res.data.success && res.data.data.length > 0) {
          const mappedCore = res.data.data.map((item) => ({
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
            hasSubmenu: false,
          }));
          const pizzaSubmenu = staticItems.find((i) => i.hasSubmenu);
          const merged = pizzaSubmenu
            ? [...mappedCore, pizzaSubmenu]
            : mappedCore;
          setBackendItems(merged);
        } else {
          setBackendItems(null);
        }
      } catch (err) {
        console.error('Failed to load lunch menu:', err);
        setBackendItems(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLunch();
  }, [staticItems]);

  const items = backendItems || staticItems;

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (priceRange !== 'all') {
      if (priceRange === '0-100') {
        filtered = filtered.filter(
          (item) => item.hasSubmenu || item.price < 100
        );
      } else if (priceRange === '100-200') {
        filtered = filtered.filter(
          (item) =>
            item.hasSubmenu ||
            (item.price >= 100 && item.price < 200)
        );
      } else if (priceRange === '200-300') {
        filtered = filtered.filter(
          (item) =>
            item.hasSubmenu ||
            (item.price >= 200 && item.price < 300)
        );
      } else if (priceRange === '300+') {
        filtered = filtered.filter(
          (item) => item.hasSubmenu || item.price >= 300
        );
      }
    }

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
  }, [items, searchQuery, sortBy, priceRange]);

  const handleItemClick = (item) => {
    if (item.hasSubmenu && item.path) {
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
          <h1>Lunch Menu</h1>
          <p className="ordering-from">
            Ordering from <span>Train</span>
          </p>
        </div>

        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {loading && <p>Loading lunch items...</p>}

        <div
          style={{
            marginBottom: '1.5rem',
            color: 'var(--text-gray)',
            fontSize: '0.95rem',
          }}
        >
          {searchQuery && (
            <p>
              Found{' '}
              <strong style={{ color: 'var(--primary-orange)' }}>
                {filteredAndSortedItems.length}
              </strong>{' '}
              result(s) for "{searchQuery}"
            </p>
          )}
          {filteredAndSortedItems.length === 0 && searchQuery && (
            <p
              style={{
                color: 'var(--text-white)',
                fontSize: '1.1rem',
                textAlign: 'center',
                padding: '2rem',
                background: 'var(--dark-card)',
                borderRadius: '10px',
              }}
            >
              No items found. Try a different search term.
            </p>
          )}
        </div>

        <div className="menu-grid">
          {filteredAndSortedItems.map((item) => (
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
                    className={`btn ${
                      item.hasSubmenu ? 'btn-explore' : 'btn-primary btn-sm'
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.hasSubmenu ? 'Explore' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default LunchMenu;
