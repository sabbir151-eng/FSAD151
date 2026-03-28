import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Preparing': 'bg-blue-100 text-blue-700',
  'Ready for Pickup': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const allStatuses = ['Pending', 'Preparing', 'Ready for Pickup', 'Delivered', 'Cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      if (sortBy) params.append('sort', sortBy);
      const { data } = await API.get(`/orders?${params}`);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setTotalOrders(data.totalOrders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [currentPage, statusFilter, sortBy]);
  useEffect(() => { setCurrentPage(1); }, [statusFilter, sortBy]);

  // Auto-refresh every 15 seconds for live orders
  useEffect(() => {
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [currentPage, statusFilter, sortBy]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Order Records</h1>
          <p className="text-gray-500 mt-1">{totalOrders} total orders • Auto-refreshes every 15s</p>
        </div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option value="">All Status</option>
            {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option value="">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_desc">Price High→Low</option>
            <option value="price_asc">Price Low→High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner"></div></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">📭</span>
          <p className="text-xl text-gray-500 mt-4">No orders found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6 card-hover">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    {/* Invoice Number - prominent display */}
                    {order.invoiceNumber && (
                      <p className="text-lg font-bold text-orange-600 mb-1">🧾 {order.invoiceNumber}</p>
                    )}
                    <p className="text-xs text-gray-400 font-mono">Order ID: #{order._id.slice(-8)}</p>
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-800">
                        👤 {order.user?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        📧 {order.user?.email || ''} • 📞 {order.user?.phone || order.phone || ''}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">🕐 {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-600">{item.name} × {item.quantity} — ₹{item.price * item.quantity}</p>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                  <div>
                    <span className="text-lg font-bold text-primary-600">₹{order.totalPrice}</span>
                    <span className="text-sm text-gray-400 ml-2">• {order.paymentMethod === 'COD' ? 'Pay at Counter' : 'Online'}</span>
                  </div>

                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <div className="flex gap-2">
                      {order.status === 'Pending' && (
                        <button onClick={() => updateStatus(order._id, 'Preparing')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button onClick={() => updateStatus(order._id, 'Ready for Pickup')}
                          className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                          Ready for Pickup
                        </button>
                      )}
                      {order.status === 'Ready for Pickup' && (
                        <button onClick={() => updateStatus(order._id, 'Delivered')}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                          Mark Picked Up
                        </button>
                      )}
                      <button onClick={() => updateStatus(order._id, 'Cancelled')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default ManageOrders;
