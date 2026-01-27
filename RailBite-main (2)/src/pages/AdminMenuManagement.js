import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'breakfast',
    image: '',
    available: true
  });

  const categories = useMemo(() => [
    'breakfast', 'lunch', 'dinner', 'burger', 'shwarma', 'snacks', 'smoothie', 'beverage', 'pizza'
  ], []);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const saved = localStorage.getItem('railbiteMenuItems');
    if (saved) {
      setMenuItems(JSON.parse(saved));
    } else {
      const defaultItems = [
        { id: 1, name: 'Chicken Biryani', price: 150, description: 'Delicious chicken biryani', category: 'lunch', image: '/images/biryani.jpg', available: true },
        { id: 2, name: 'Beef Burger', price: 200, description: 'Juicy beef burger', category: 'burger', image: '/images/burger.jpg', available: true },
        { id: 3, name: 'Chocolate Shake', price: 150, description: 'Rich chocolate shake', category: 'smoothie', image: '/images/shake.jpg', available: true }
      ];
      setMenuItems(defaultItems);
      localStorage.setItem('railbiteMenuItems', JSON.stringify(defaultItems));
    }
  };

  const saveMenuItems = (items) => {
    localStorage.setItem('railbiteMenuItems', JSON.stringify(items));
    setMenuItems(items);
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, filterCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = menuItems.map(item =>
        item.id === editingItem.id ? { ...formData, id: item.id } : item
      );
      saveMenuItems(updated);
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price)
      };
      saveMenuItems([...menuItems, newItem]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updated = menuItems.filter(item => item.id !== id);
      saveMenuItems(updated);
    }
  };

  const toggleAvailability = (id) => {
    const updated = menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    saveMenuItems(updated);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'breakfast',
      image: '',
      available: true
    });
    setEditingItem(null);
    setShowAddModal(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Menu Management</h1>
            <p>Manage your menu items, categories, and availability</p>
          </div>
          <button className="admin-btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New Item
          </button>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.image || '/images/placeholder.jpg'} alt={item.name} className="admin-table-img" />
                      </td>
                      <td>
                        <div>
                          <strong>{item.name}</strong>
                          <p className="admin-table-description">{item.description}</p>
                        </div>
                      </td>
                      <td>
                        <span className="admin-category-badge">{item.category}</span>
                      </td>
                      <td>৳{item.price}</td>
                      <td>
                        <button
                          className={`admin-toggle-btn ${item.available ? 'active' : ''}`}
                          onClick={() => toggleAvailability(item.id)}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td>
                        <div className="admin-action-buttons">
                          <button className="admin-btn-edit" onClick={() => handleEdit(item)}>
                            Edit
                          </button>
                          <button className="admin-btn-delete" onClick={() => handleDelete(item.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                                    ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No menu items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="admin-modal-overlay" onClick={resetForm}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button className="admin-modal-close" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter item name"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Price (৳) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter item description"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="/images/item.jpg"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                    />
                    <span>Available for order</span>
                  </label>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuManagement;

