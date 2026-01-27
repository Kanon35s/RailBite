import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import api from '../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reports');
      setReports(res.data.data);
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to load reports',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-content">
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reports) return null;

  const { orders, staffPerformance, userActivity } = reports;

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Reports</h1>
          <p>Real-time performance and activity reports</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Orders Today</p>
              <h3 className="admin-stat-value">{orders.daily}</h3>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Orders This Week</p>
              <h3 className="admin-stat-value">{orders.weekly}</h3>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Orders This Month</p>
              <h3 className="admin-stat-value">{orders.monthly}</h3>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Delivered vs Pending</p>
              <h3 className="admin-stat-value">
                {orders.delivered} / {orders.pending}
              </h3>
            </div>
          </div>
        </div>

        <section style={{ marginTop: '2rem' }}>
          <h2>Staff Performance</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Completed Today</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      No staff data
                    </td>
                  </tr>
                ) : (
                  staffPerformance.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.type}</td>
                      <td>{s.status}</td>
                      <td>{s.completedToday ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>User Activity</h2>
          <div className="admin-stats-grid admin-stats-grid-small">
            <div className="admin-stat-card">
              <div className="admin-stat-content">
                <p className="admin-stat-label">Total Users</p>
                <h3 className="admin-stat-value">
                  {userActivity.totalUsers}
                </h3>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-content">
                <p className="admin-stat-label">Active Users</p>
                <h3 className="admin-stat-value">
                  {userActivity.activeUsers}
                </h3>
              </div>
            </div>
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

export default AdminReports;
