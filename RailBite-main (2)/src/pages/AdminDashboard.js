import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    deliveryStaff: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);

  const statsData = useMemo(() => [
    { label: "Today's Orders", value: stats.todayOrders, icon: '📦', color: '#4ECDC4', change: '+12%' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#FFE66D', change: '+5%' },
    { label: 'Completed Today', value: stats.completedOrders, icon: '✅', color: '#95E1D3', change: '+8%' },
    { label: 'Revenue (Today)', value: `৳${stats.totalRevenue}`, icon: '💰', color: '#FF6B35', change: '+15%' },
    { label: 'Active Users', value: stats.activeUsers, icon: '👥', color: '#A8DADC', change: '+3%' },
    { label: 'Delivery Staff', value: stats.deliveryStaff, icon: '🚚', color: '#E9C46A', change: '0%' }
  ], [stats]);

  useEffect(() => {
    const fetchDashboardData = () => {
      const orders = JSON.parse(localStorage.getItem('railbiteOrders') || '[]');
      const today = new Date().toDateString();
      
      const todayOrders = orders.filter(order => 
        new Date(order.orderDate).toDateString() === today
      );

      const pendingOrders = orders.filter(order => 
        order.status === 'placed' || order.status === 'preparing'
      );

      const completedToday = todayOrders.filter(order => 
        order.status === 'delivered'
      );

      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        todayOrders: todayOrders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedToday.length,
        totalRevenue: todayRevenue.toFixed(2),
        activeUsers: 125,
        deliveryStaff: 15
      });

      const recent = orders.slice(0, 5).map(order => ({
        id: order.id,
        customer: order.contactName || 'Customer',
        items: order.items?.length || 0,
        total: order.total,
        status: order.status,
        time: new Date(order.orderDate).toLocaleTimeString()
      }));
      setRecentOrders(recent);

      setPopularItems([
        { name: 'Chicken Biryani', orders: 45, revenue: 6750 },
        { name: 'Beef Burger', orders: 38, revenue: 7600 },
        { name: 'Chocolate Shake', orders: 32, revenue: 4800 },
        { name: 'Chicken Pizza', orders: 28, revenue: 8400 },
        { name: 'Mutton Kacchi', orders: 25, revenue: 6250 }
      ]);
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      'placed': 'status-placed',
      'preparing': 'status-preparing',
      'on the way': 'status-ontheway',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>

        <div className="admin-stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="admin-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="admin-stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div className="admin-stat-content">
                <p className="admin-stat-label">{stat.label}</p>
                <h3 className="admin-stat-value">{stat.value}</h3>
                <span className="admin-stat-change">{stat.change} from yesterday</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-dashboard-grid">
          <div className="admin-card admin-recent-orders">
            <div className="admin-card-header">
              <h2>Recent Orders</h2>
              <button className="admin-btn-link">View All</button>
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
                    recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.items} items</td>
                        <td>৳{order.total}</td>
                        <td>
                          <span className={`admin-status-badge ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                        No recent orders
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
              <button className="admin-btn-link">View Report</button>
            </div>
            <div className="popular-items-list">
              {popularItems.map((item, index) => (
                <div key={index} className="popular-item">
                  <div className="popular-item-rank">{index + 1}</div>
                  <div className="popular-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.orders} orders</p>
                  </div>
                  <div className="popular-item-revenue">
                    ৳{item.revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
