<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import api from '../services/api';

const AdminMenuManagement = () => {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'pizza',
    available: true,
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/menu');
      setItems(res.data.data || []);
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to load menu items',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'pizza',
      available: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      setToast({ message: 'Name and price are required', type: 'error' });
      return;
    }
    try {
      if (editingItem) {
        const res = await api.put(
          `/admin/menu/${editingItem._id}`,
          { ...formData, price: Number(formData.price) }
        );
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? res.data.data : i))
        );
        setToast({ message: 'Menu item updated', type: 'success' });
      } else {
        const res = await api.post('/admin/menu', {
          ...formData,
          price: Number(formData.price),
        });
        setItems((prev) => [res.data.data, ...prev]);
        setToast({ message: 'Menu item added', type: 'success' });
      }
      resetForm();
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to save menu item',
        type: 'error',
      });
    }
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
  };

  const handleEdit = (item) => {
    setEditingItem(item);
<<<<<<< HEAD
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
=======
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      category: item.category,
      available: item.available,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/admin/menu/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setToast({ message: 'Menu item deleted', type: 'success' });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to delete menu item',
        type: 'error',
      });
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const res = await api.put(`/admin/menu/${item._id}`, {
        available: !item.available,
      });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? res.data.data : i))
      );
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to update availability',
        type: 'error',
      });
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Menu Management</h1>
          <p>Manage all menu items and availability</p>
        </div>

        <div className="admin-form-container">
          <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Price (৳)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="images/example.png or https://..."
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="pizza">Pizza</option>
                <option value="burger">Burger</option>
                <option value="smoothie">Smoothie</option>
                <option value="shwarma">Shwarma</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                Available
              </label>
            </div>
            <div className="admin-form-actions">
              {editingItem && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>

        <section style={{ marginTop: '2rem' }}>
          <h2>All Menu Items</h2>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
<<<<<<< HEAD
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
=======
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
<<<<<<< HEAD
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
=======
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Loading...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>৳{item.price}</td>
                      <td>
                        <button
                          className={`admin-toggle-btn ${
                            item.available ? 'active' : 'blocked'
                          }`}
                          onClick={() => toggleAvailability(item)}
                        >
                          {item.available ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                      <td>
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
                )}
              </tbody>
            </table>
          </div>
<<<<<<< HEAD
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
=======
        </section>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
        )}
      </div>
    </div>
  );
};

export default AdminMenuManagement;
<<<<<<< HEAD

=======
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
