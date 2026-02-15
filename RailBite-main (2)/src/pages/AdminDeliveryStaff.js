// src/pages/AdminDeliveryStaff.js
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import api from '../services/api';

const AdminDeliveryStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'train', // train | station
    vehicle: '',
  });

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/delivery-staff');
      setStaff(res.data.data || []);
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to load delivery staff',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setToast({ message: 'Name and phone are required', type: 'error' });
      return;
    }
    try {
      await api.post('/admin/delivery-staff', formData);
      setToast({ message: 'Delivery staff added', type: 'success' });
      setFormData({
        name: '',
        phone: '',
        type: 'train',
        vehicle: '',
      });
      loadStaff();
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to add delivery staff',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await api.delete(`/admin/delivery-staff/${id}`);
      setToast({ message: 'Staff deleted', type: 'success' });
      setStaff((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to delete staff',
        type: 'error',
      });
    }
  };

  const trainStaff = staff.filter((s) => s.type === 'train');
  const stationStaff = staff.filter((s) => s.type === 'station');

  const renderStatusBadge = (status) => {
    const cls =
      status === 'busy' ? 'status-busy' : 'status-available';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Delivery Staff Management</h1>
          <p>Manage train and station delivery staff</p>
        </div>

        <div className="admin-form-container">
          <h2>Add Delivery Staff</h2>
          <form onSubmit={handleCreate} className="admin-form">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Staff name"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 017XXXXXXXX"
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="train">Train</option>
                <option value="station">Station</option>
              </select>
            </div>
            {formData.type === 'station' && (
              <div className="form-group">
                <label>Vehicle</label>
                <input
                  name="vehicle"
                  type="text"
                  value={formData.vehicle}
                  onChange={handleChange}
                  placeholder="e.g., Bike, Rickshaw"
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-block">
              Add Staff
            </button>
          </form>
        </div>

        {loading ? (
          <p>Loading staff...</p>
        ) : (
          <>
            <section style={{ marginTop: '2rem' }}>
              <h2>Delivery Staff – Train</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Completed Today</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainStaff.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center' }}>
                          No train delivery staff found
                        </td>
                      </tr>
                    ) : (
                      trainStaff.map((s) => (
                        <tr key={s._id}>
                          <td>{s.staffId}</td>
                          <td>{s.name}</td>
                          <td>{s.phone}</td>
                          <td>{renderStatusBadge(s.status)}</td>
                          <td>{s.completedToday ?? 0}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(s._id)}
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

            <section style={{ marginTop: '2rem' }}>
              <h2>Delivery Staff – Station</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Vehicle</th>
                      <th>Status</th>
                      <th>Completed Today</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stationStaff.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>
                          No station delivery staff found
                        </td>
                      </tr>
                    ) : (
                      stationStaff.map((s) => (
                        <tr key={s._id}>
                          <td>{s.staffId}</td>
                          <td>{s.name}</td>
                          <td>{s.phone}</td>
                          <td>{s.vehicle || '-'}</td>
                          <td>{renderStatusBadge(s.status)}</td>
                          <td>{s.completedToday ?? 0}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(s._id)}
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
          </>
        )}

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

export default AdminDeliveryStaff;
