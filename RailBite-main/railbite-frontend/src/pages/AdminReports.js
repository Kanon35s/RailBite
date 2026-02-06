import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { orderAPI } from '../services/api';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [reportData, setReportData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topItems: [],
    categoryBreakdown: [],
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    generateReport();
  }, [orders, dateRange]);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.adminList(); // optionally pass { status: 'delivered' }
      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('AdminReports loadOrders error:', err);
      setOrders([]);
    }
  };

  const getFilteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (dateRange) {
        case 'today':
          return orderDate >= today;
        case 'week': {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        default:
          return true;
      }
    });
  }, [orders, dateRange]);

  const generateReport = () => {
    const filtered = getFilteredOrders;
    const totalOrders = filtered.length;
    const totalRevenue = filtered.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemCounts = {};
    const categoryRevenue = {};

    filtered.forEach((order) => {
      order.items?.forEach((item) => {
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
      categoryBreakdown,
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
${reportData.topItems
  .map((item, i) => `${i + 1}. ${item.name} - ${item.count} orders`)
  .join('\n')}

Category Breakdown:
${reportData.categoryBreakdown
  .map((cat) => `${cat.category}: ৳${cat.revenue.toFixed(2)}`)
  .join('\n')}
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
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Reports
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View sales reports and business insights.
            </p>
          </header>

          {/* Filters and summary */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Date Range:</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <button
                onClick={exportReport}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Export Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">
                  Total Orders
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {reportData.totalOrders}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">
                  Total Revenue
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  ৳{reportData.totalRevenue}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">
                  Avg Order Value
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  ৳{reportData.averageOrderValue}
                </p>
              </div>
            </div>
          </section>

          {/* Top selling items */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Top Selling Items
            </h2>
            {reportData.topItems.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-2 text-left">Rank</th>
                      <th className="px-4 py-2 text-left">Item Name</th>
                      <th className="px-4 py-2 text-left">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topItems.map((item, index) => (
                      <tr
                        key={item.name}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">#{index + 1}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Category breakdown */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Revenue by Category
            </h2>
            {reportData.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Revenue</th>
                      <th className="px-4 py-2 text-left">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.categoryBreakdown.map((cat) => {
                      const percentage =
                        reportData.totalRevenue > 0
                          ? (
                              (cat.revenue /
                                parseFloat(reportData.totalRevenue || '1')) *
                              100
                            ).toFixed(1)
                          : 0;

                      return (
                        <tr
                          key={cat.category}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">{cat.category}</td>
                          <td className="px-4 py-2">
                            ৳{cat.revenue.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">{percentage}%</td>
                        </tr>
                      );
                    })}
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

export default AdminReports;
