<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [reportData, setReportData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topItems: [],
    categoryBreakdown: [],
    hourlyData: []
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    generateReport();
  }, [orders, dateRange]);

  const loadOrders = () => {
    const saved = localStorage.getItem('railbiteOrders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  };

  const getFilteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      
      switch(dateRange) {
        case 'today':
          return orderDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [orders, dateRange]);

  const generateReport = () => {
    const filtered = getFilteredOrders;
    
    const totalOrders = filtered.length;
    const totalRevenue = filtered.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemCounts = {};
    const categoryRevenue = {};

    filtered.forEach(order => {
      order.items?.forEach(item => {
        if (itemCounts[item.name]) {
          itemCounts[item.name] += item.quantity;
        } else {
          itemCounts[item.name] = item.quantity;
        }
      });

      const category = order.orderType || 'Other';
      if (categoryRevenue[category]) {
        categoryRevenue[category] += order.total || 0;
      } else {
        categoryRevenue[category] = order.total || 0;
      }
    });

    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const categoryBreakdown = Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    setReportData({
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2),
      topItems,
      categoryBreakdown
    });
  };

  const exportReport = () => {
    const reportText = `
RailBite Sales Report
Date Range: ${dateRange}
Generated: ${new Date().toLocaleString()}

Summary:
- Total Orders: ${reportData.totalOrders}
- Total Revenue: ৳${reportData.totalRevenue}
- Average Order Value: ৳${reportData.averageOrderValue}

Top Selling Items:
${reportData.topItems.map((item, i) => `${i + 1}. ${item.name} - ${item.count} orders`).join('\n')}

Category Breakdown:
${reportData.categoryBreakdown.map(cat => `${cat.category}: ৳${cat.revenue.toFixed(2)}`).join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `railbite-report-${dateRange}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>View sales reports and business insights</p>
          </div>
          <button className="admin-btn-primary" onClick={exportReport}>
            📥 Export Report
          </button>
        </div>

        <div className="admin-filters">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="admin-filter-select"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
=======
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
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
<<<<<<< HEAD
            <div className="admin-stat-icon" style={{ backgroundColor: '#4ECDC420', color: '#4ECDC4' }}>
              📦
            </div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Total Orders</p>
              <h3 className="admin-stat-value">{reportData.totalOrders}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ backgroundColor: '#FF6B3520', color: '#FF6B35' }}>
              💰
            </div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Total Revenue</p>
              <h3 className="admin-stat-value">৳{reportData.totalRevenue}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ backgroundColor: '#95E1D320', color: '#95E1D3' }}>
              📊
            </div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Avg Order Value</p>
                            <h3 className="admin-stat-value">৳{reportData.averageOrderValue}</h3>
=======
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
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="admin-dashboard-grid">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Top Selling Items</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Item Name</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topItems.length > 0 ? (
                    reportData.topItems.map((item, index) => (
                      <tr key={index}>
                        <td><strong>#{index + 1}</strong></td>
                        <td>{item.name}</td>
                        <td>{item.count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Revenue by Category</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Revenue</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.categoryBreakdown.length > 0 ? (
                    reportData.categoryBreakdown.map((cat, index) => {
                      const percentage = ((cat.revenue / parseFloat(reportData.totalRevenue)) * 100).toFixed(1);
                      return (
                        <tr key={index}>
                          <td><strong>{cat.category}</strong></td>
                          <td>৳{cat.revenue.toFixed(2)}</td>
                          <td>
                            <div className="percentage-bar">
                              <div className="percentage-fill" style={{ width: `${percentage}%` }}></div>
                              <span>{percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
=======
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
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      </div>
    </div>
  );
};

export default AdminReports;
<<<<<<< HEAD

=======
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
