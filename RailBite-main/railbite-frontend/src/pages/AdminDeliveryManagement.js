import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDeliveryManagement = () => {
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    status: 'available',
  });

  useEffect(() => {
    loadDeliveryStaff();
  }, []);

  const loadDeliveryStaff = () => {
    const saved = localStorage.getItem('railbiteDeliveryStaff');
    if (saved) {
      setDeliveryStaff(JSON.parse(saved));
    } else {
      const defaultStaff = [
        {
          id: 1,
          name: 'Karim Ahmed',
          phone: '01712345678',
          vehicleType: 'bike',
          vehicleNumber: 'DHA-1234',
          status: 'available',
          assignedOrders: 0,
          completedToday: 5,
        },
        {
          id: 2,
          name: 'Rahim Mia',
          phone: '01812345678',
          vehicleType: 'bike',
          vehicleNumber: 'DHA-5678',
          status: 'busy',
          assignedOrders: 1,
          completedToday: 3,
        },
        {
          id: 3,
          name: 'Salman Khan',
          phone: '01912345678',
          vehicleType: 'car',
          vehicleNumber: 'DHA-9012',
          status: 'available',
          assignedOrders: 0,
          completedToday: 7,
        },
      ];
      setDeliveryStaff(defaultStaff);
      localStorage.setItem('railbiteDeliveryStaff', JSON.stringify(defaultStaff));
    }
  };

  const saveDeliveryStaff = (updatedStaff) => {
    localStorage.setItem('railbiteDeliveryStaff', JSON.stringify(updatedStaff));
    setDeliveryStaff(updatedStaff);
  };

  const filteredStaff = useMemo(() => {
    return deliveryStaff.filter((staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery) ||
      staff.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deliveryStaff, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStaff) {
      const updated = deliveryStaff.map((staff) =>
        staff.id === editingStaff.id ? { ...staff, ...formData } : staff
      );
      saveDeliveryStaff(updated);
    } else {
      const newStaff = {
        ...formData,
        id: Date.now(),
        assignedOrders: 0,
        completedToday: 0,
      };
      saveDeliveryStaff([...deliveryStaff, newStaff]);
    }

    resetForm();
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      phone: staff.phone,
      vehicleType: staff.vehicleType,
      vehicleNumber: staff.vehicleNumber,
      status: staff.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery staff?')) {
      const updated = deliveryStaff.filter((staff) => staff.id !== id);
      saveDeliveryStaff(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      vehicleType: 'bike',
      vehicleNumber: '',
      status: 'available',
    });
    setEditingStaff(null);
    setShowAddModal(false);
  };

  // Stats for header cards
  const totalStaff = deliveryStaff.length;
  const availableCount = deliveryStaff.filter((s) => s.status === 'available').length;
  const busyCount = deliveryStaff.filter((s) => s.status === 'busy').length;
  const offlineCount = deliveryStaff.filter((s) => s.status === 'offline').length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Delivery Staff Management</h1>
            <p>Manage delivery personnel and assignments</p>
          </div>
          <button
            className="admin-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Delivery Staff
          </button>
        </div>

        {/* Stats cards row */}
        <div className="admin-stats-grid admin-stats-grid-small">
          <div className="admin-stat-card admin-stat-staff-total">
            <div className="admin-stat-icon">🚚</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Total Staff</p>
              <h3 className="admin-stat-value">{totalStaff}</h3>
              <span className="admin-stat-sub">All delivery personnel</span>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-staff-available">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Available</p>
              <h3 className="admin-stat-value">{availableCount}</h3>
              <span className="admin-stat-sub">Ready to take orders</span>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-staff-busy">
            <div className="admin-stat-icon">📦</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Busy</p>
              <h3 className="admin-stat-value">{busyCount}</h3>
              <span className="admin-stat-sub">Currently delivering</span>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-staff-offline">
            <div className="admin-stat-icon">⏸</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Offline</p>
              <h3 className="admin-stat-value">{offlineCount}</h3>
              <span className="admin-stat-sub">Not available</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search delivery staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* Table */}
        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Completed Today</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id}>
                      <td>#{staff.id}</td>
                      <td>
                        <strong>{staff.name}</strong>
                      </td>
                      <td>{staff.phone}</td>
                      <td>
                        <div>
                          <span className="vehicle-type">{staff.vehicleType}</span>
                          <br />
                          <small>{staff.vehicleNumber}</small>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-status-badge status-${staff.status}`}
                        >
                          {staff.status}
                        </span>
                      </td>
                      <td>{staff.assignedOrders}</td>
                      <td>{staff.completedToday}</td>
                      <td>
                        <div className="admin-action-buttons">
                          <button
                            className="admin-btn-edit"
                            onClick={() => handleEdit(staff)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDelete(staff.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: 'center', padding: '20px' }}
                    >
                      No delivery staff found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="admin-modal-overlay" onClick={resetForm}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingStaff ? 'Edit Delivery Staff' : 'Add Delivery Staff'}</h2>
                <button className="admin-modal-close" onClick={resetForm}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="01712345678"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Vehicle Type *</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="bike">Bike</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Vehicle Number *</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="DHA-1234"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingStaff ? 'Update Staff' : 'Add Staff'}
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

export default AdminDeliveryManagement;
