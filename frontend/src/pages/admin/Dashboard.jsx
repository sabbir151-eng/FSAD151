import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [popular, setPopular] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, popRes, revRes] = await Promise.all([
          API.get(`/analytics/orders?period=${period}`),
          API.get('/analytics/popular?limit=8'),
          API.get('/analytics/revenue'),
        ]);
        setStats(statsRes.data);
        setPopular(popRes.data);
        setRevenue(revRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [period]);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;

  // Chart data for daily orders
  const dailyChartData = {
    labels: stats?.dailyOrders?.map((d) => d._id) || [],
    datasets: [
      {
        label: 'Orders',
        data: stats?.dailyOrders?.map((d) => d.count) || [],
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        borderColor: '#f97316',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Revenue (₹)',
        data: stats?.dailyOrders?.map((d) => d.revenue) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Doughnut chart for order status
  const statusLabels = stats?.statusStats?.map((s) => s._id) || [];
  const statusData = {
    labels: statusLabels,
    datasets: [{
      data: stats?.statusStats?.map((s) => s.count) || [],
      backgroundColor: ['#FBBF24', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'],
      borderWidth: 0,
    }],
  };

  // Popular dishes bar chart
  const popularChartData = {
    labels: popular.map((p) => p.name),
    datasets: [{
      label: 'Orders',
      data: popular.map((p) => p.orderCount),
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderRadius: 8,
    }],
  };

  // Revenue line chart
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueChartData = {
    labels: revenue.map((r) => `${months[r._id.month]} ${r._id.year}`).reverse(),
    datasets: [{
      label: 'Revenue (₹)',
      data: [...revenue].reverse().map((r) => r.revenue),
      fill: true,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      borderColor: '#f97316',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: '#f97316',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                period === p ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FiShoppingBag />, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'from-orange-400 to-orange-600' },
          { icon: <FiDollarSign />, label: 'Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, color: 'from-green-400 to-green-600' },
          { icon: <FiTrendingUp />, label: 'Popular Items', value: popular.length, color: 'from-blue-400 to-blue-600' },
          { icon: <FiUsers />, label: 'Avg Order Value', value: stats?.totalOrders ? `₹${Math.round(stats.totalRevenue / stats.totalOrders)}` : '₹0', color: 'from-purple-400 to-purple-600' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white card-hover`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Daily Orders & Revenue</h2>
          <div className="h-64"><Bar data={dailyChartData} options={chartOptions} /></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Status Distribution</h2>
          <div className="h-64"><Doughnut data={statusData} options={chartOptions} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 Most Popular Dishes</h2>
          <div className="h-64"><Bar data={popularChartData} options={{ ...chartOptions, indexAxis: 'y' }} /></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💰 Revenue Trend</h2>
          <div className="h-64"><Line data={revenueChartData} options={chartOptions} /></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
