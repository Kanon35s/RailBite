import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { menuAPI } from '../services/api';

const AdminMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'breakfast',
    available: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = useMemo(() => [
    'breakfast', 'lunch', 'dinner',
    'biryani', 'burger', 'pizza',
    'shwarma', 'beverage', 'smoothie', 'snacks'
  ], []);

  // Load menu items from backend on mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await menuAPI.getAll();
      if (res.data.success) {
        setMenuItems(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load menu');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading menu');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === 'all' || item.category === filterCategory;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('railbite_token');

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('price', parseFloat(formData.price));
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('available', formData.available);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      if (editingItem) {
        // Update existing item
        const res = await menuAPI.update(editingItem._id, fd, token);
        if (res.data.success) {
          setMenuItems(prev =>
            prev.map(item =>
              item._id === editingItem._id ? res.data.data : item
            )
          );
          alert('Menu item updated successfully.');
        }
      } else {
        // Create new item
        const res = await menuAPI.create(fd, token);
        if (res.data.success) {
          setMenuItems(prev => [res.data.data, ...prev]);
          alert('Menu item added successfully.');
        }
      }

      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      available: item.available
    });
    setImageFile(null);
    setImagePreview(item.image || '');
    setShowAddModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('railbite_token');
      const res = await menuAPI.delete(item._id, token);
      if (res.data.success) {
        setMenuItems(prev => prev.filter(m => m._id !== item._id));
        alert('Menu item deleted.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const token = localStorage.getItem('railbite_token');
      const res = await menuAPI.toggleAvailability(item._id, !item.available, token);
      if (res.data.success) {
        setMenuItems(prev =>
          prev.map(m => m._id === item._id ? res.data.data : m)
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to toggle availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'breakfast',
      available: true
    });
    setImageFile(null);
    setImagePreview('');
    setEditingItem(null);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-header">
            <h1>Menu Management</h1>
            <p>Loading menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-header">
            <h1>Menu Management</h1>
            <p className="admin-error-text">Error: {error}</p>
            <button className="admin-btn-primary" onClick={loadMenuItems}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Menu Management</h1>
            <p>Manage your menu items, categories, and availability</p>
          </div>
          <button
            className="admin-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Item
          </button>
        </div>

        {/* Filters */}
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
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
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
                    <tr key={item._id}>
                      <td>
                        <img
                          src={
                            item.image
                              ? item.image.startsWith('/uploads')
                                ? `http://localhost:5001${item.image}`
                                : item.image
                              : '/images/placeholder.jpg'
                          }
                          alt={item.name}
                          className="admin-table-img"
                        />
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
                          onClick={() => toggleAvailability(item)}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td>
                        <div className="admin-action-buttons">
                          <button
                            className="admin-btn-edit"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="admin-empty-cell">
                      No menu items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
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
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
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
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="admin-file-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="admin-image-preview">
                      <img
                        src={imagePreview.startsWith('blob:') ? imagePreview : `http://localhost:5001${imagePreview}`}
                        alt="Preview"
                      />
                    </div>
                  )}
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
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving...'
                      : editingItem
                        ? 'Update Item'
                        : 'Add Item'}
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