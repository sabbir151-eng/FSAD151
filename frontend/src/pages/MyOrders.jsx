import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Preparing': 'bg-blue-100 text-blue-700',
  'Ready for Pickup': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/orders/my?page=${currentPage}&limit=5`);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [currentPage]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await API.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">📭</span>
          <p className="text-xl text-gray-500 mt-4">No orders yet</p>
          <Link to="/menu" className="inline-block mt-4 bg-primary-500 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-all">
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6 card-hover">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  {order.invoiceNumber && (
                    <p className="text-sm font-semibold text-orange-600 mb-1">🧾 {order.invoiceNumber}</p>
                  )}
                  <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
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

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-lg font-bold text-primary-600">₹{order.totalPrice}</span>
                <div className="flex gap-2">
                  <Link to={`/order/${order._id}`}
                    className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
                    View Invoice
                  </Link>
                  {order.status === 'Pending' && (
                    <button onClick={() => handleCancel(order._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default MyOrders;
