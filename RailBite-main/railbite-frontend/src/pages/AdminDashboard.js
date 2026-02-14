import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { orderAPI } from '../services/api';

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
        // 1) Stats from backend
        const statsRes = await orderAPI.adminStats();
        if (statsRes.data.success) {
          const d = statsRes.data.data;
          setStats({
            todayOrders: d.todayOrders,
            pendingOrders: d.pendingOrders,
            completedOrders: d.completedOrders,
            totalRevenue: d.totalRevenue, // already toFixed(2) in backend
            activeUsers: d.activeUsers,
            deliveryStaff: d.deliveryStaff,
          });
        }

        // 2) Recent orders from backend
        const recentRes = await orderAPI.adminRecent(5);
        if (recentRes.data.success) {
          setRecentOrders(recentRes.data.data || []);
        }

        // 3) Popular items – still static for now
        setPopularItems([
          { name: 'Chicken Biryani', orders: 45, revenue: 6750 },
          { name: 'Beef Burger', orders: 38, revenue: 7600 },
          { name: 'Chocolate Shake', orders: 32, revenue: 4800 },
          { name: 'Chicken Pizza', orders: 28, revenue: 8400 },
          { name: 'Mutton Kacchi', orders: 25, revenue: 6250 },
        ]);
      } catch (err) {
        console.error('AdminDashboard fetchDashboardData error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      placed: 'status-placed',
      preparing: 'status-preparing',
      'on the way': 'status-ontheway',
      ontheway: 'status-ontheway',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back! Here&apos;s what&apos;s happening today.
            </p>
          </header>

          {/* KPI cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full text-xl"
                  style={{ backgroundColor: `${stat.color}22` }}
                >
                  <span>{stat.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {stat.change} vs last period
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Recent orders */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Orders
              </h2>
              <span className="text-xs text-gray-500">
                Last {recentOrders.length} orders
              </span>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No recent orders.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Items</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">#{order.id}</td>
                        <td className="px-4 py-2">
                          {order.customer || 'Customer'}
                        </td>
                        <td className="px-4 py-2">
                          {order.items} items
                        </td>
                        <td className="px-4 py-2">৳{order.total}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {order.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Popular items (static for now) */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Popular Items
            </h2>
            {popularItems.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">Orders</th>
                      <th className="px-4 py-2 text-left">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularItems.map((item) => (
                      <tr
                        key={item.name}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.orders}</td>
                        <td className="px-4 py-2">৳{item.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
