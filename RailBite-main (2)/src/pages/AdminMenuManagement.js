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
  };

  const handleEdit = (item) => {
    setEditingItem(item);
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
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
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
                )}
              </tbody>
            </table>
          </div>
        </section>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMenuManagement;
