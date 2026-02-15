import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('railbiteToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    deliveryStaff: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const statsData = useMemo(
    () => [
      {
        label: "Today's Orders",
        value: stats.todayOrders,
        icon: '📦',
        color: '#4ECDC4',
        change: '+12%',
      },
      {
        label: 'Pending Orders',
        value: stats.pendingOrders,
        icon: '⏳',
        color: '#FFE66D',
        change: '+5%',
      },
      {
        label: 'Completed Today',
        value: stats.completedOrders,
        icon: '✅',
        color: '#95E1D3',
        change: '+8%',
      },
      {
        label: 'Revenue (Today)',
        value: `৳${stats.totalRevenue}`,
        icon: '💰',
        color: '#FF6B35',
        change: '+15%',
      },
      {
        label: 'Active Users',
        value: stats.activeUsers,
        icon: '👥',
        color: '#A8DADC',
        change: '+3%',
      },
      {
        label: 'Delivery Staff',
        value: stats.deliveryStaff,
        icon: '🚚',
        color: '#E9C46A',
        change: '0%',
      },
    ],
    [stats]
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Overall stats from backend
        const statsRes = await axios.get(
          `${API_URL}/admin/stats`,
          getAuthConfig()
        );
        if (statsRes.data.success) {
          const d = statsRes.data.data || {};
          setStats({
            todayOrders: d.todayOrders || 0,
            pendingOrders: d.pendingOrders || 0,
            completedOrders: d.completedOrders || 0,
            totalRevenue: d.totalRevenue || 0,
            activeUsers: d.activeUsers || 0,
            deliveryStaff: d.deliveryStaff || 0,
          });
        }

        // 2) Recent orders (admin view)
        const ordersRes = await axios.get(
          `${API_URL}/orders`,
          {
            params: { status: 'all', limit: 5 },
            ...getAuthConfig(),
          }
        );
        if (ordersRes.data.success) {
          const orders = ordersRes.data.data || [];
          const recent = orders.slice(0, 5).map((order) => ({
            id: order._id || order.id,
            customer:
              order.contactInfo?.fullName ||
              order.user?.name ||
              'Customer',
            items: order.items?.length || 0,
            total: order.total || 0,
            status: order.status,
            time: order.orderDate
              ? new Date(order.orderDate).toLocaleTimeString()
              : '',
          }));
          setRecentOrders(recent);
        } else {
          setRecentOrders([]);
        }

        // 3) Popular items (you need a backend route; example: /admin/reports/popular-items)
        try {
          const popularRes = await axios.get(
            `${API_URL}/admin/reports/popular-items`,
            getAuthConfig()
          );
          if (popularRes.data.success) {
            setPopularItems(popularRes.data.data || []);
          } else {
            setPopularItems([]);
          }
        } catch {
          // If you don't have this route yet, just show empty list
          setPopularItems([]);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(
          err.response?.data?.message || 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      placed: 'status-placed',
      preparing: 'status-preparing',
      'on the way': 'status-ontheway',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <div className="admin-stats-grid">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="admin-stat-card"
              style={{ borderLeftColor: stat.color }}
            >
              <div
                className="admin-stat-icon"
                style={{
                  backgroundColor: stat.color + '20',
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div className="admin-stat-content">
                <p className="admin-stat-label">{stat.label}</p>
                <h3 className="admin-stat-value">
                  {loading ? '...' : stat.value}
                </h3>
                <span className="admin-stat-change">
                  {stat.change} from yesterday
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-dashboard-grid">
          <div className="admin-card admin-recent-orders">
            <div className="admin-card-header">
              <h2>Recent Orders</h2>
              <button className="admin-btn-link">
                View All
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.items} items</td>
                        <td>৳{order.total}</td>
                        <td>
                          <span
                            className={`admin-status-badge ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                        }}
                      >
                        {loading
                          ? 'Loading recent orders...'
                          : 'No recent orders'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-card admin-popular-items">
            <div className="admin-card-header">
              <h2>Popular Items</h2>
              <button className="admin-btn-link">
                View Report
              </button>
            </div>
            <div className="popular-items-list">
              {popularItems.length === 0 ? (
                <p
                  style={{
                    textAlign: 'center',
                    color: 'var(--text-gray)',
                  }}
                >
                  {loading
                    ? 'Loading popular items...'
                    : 'No data available yet.'}
                </p>
              ) : (
                popularItems.map((item, index) => (
                  <div key={item._id || index} className="popular-item">
                    <div className="popular-item-rank">
                      {index + 1}
                    </div>
                    <div className="popular-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.orders} orders</p>
                    </div>
                    <div className="popular-item-revenue">
                      ৳{item.revenue}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
