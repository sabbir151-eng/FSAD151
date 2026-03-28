import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { FiCheckCircle, FiClock, FiPackage, FiXCircle, FiCoffee } from 'react-icons/fi';

const statusSteps = [
  { status: 'Pending', icon: <FiClock />, label: 'Order Placed', color: 'text-yellow-500' },
  { status: 'Preparing', icon: <FiPackage />, label: 'Preparing', color: 'text-blue-500' },
  { status: 'Ready for Pickup', icon: <FiCoffee />, label: 'Ready for Pickup', color: 'text-purple-500' },
  { status: 'Delivered', icon: <FiCheckCircle />, label: 'Picked Up', color: 'text-green-500' },
];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  // Poll for updates every 10 seconds
  useEffect(() => {
    if (!order || order.status === 'Delivered' || order.status === 'Cancelled') return;
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [order]);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;
  if (!order) return <div className="text-center py-20"><p className="text-xl text-gray-500">Order not found</p></div>;

  const currentIdx = statusSteps.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📦 Order Tracking</h1>
        <Link to="/my-orders" className="text-primary-500 hover:text-primary-600 font-medium">← Back to Orders</Link>
      </div>

      {/* Invoice Banner */}
      {order.invoiceNumber && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Invoice Number</p>
              <p className="text-2xl font-bold text-orange-700">{order.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-lg font-semibold text-gray-800">{order.user?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{order.phone}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Show this invoice number to canteen staff for pickup</p>
        </div>
      )}

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        {isCancelled ? (
          <div className="text-center py-6">
            <FiXCircle className="text-5xl text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-500 mt-3">Order Cancelled</h2>
          </div>
        ) : (
          <div className="flex items-center justify-between relative">
            {/* Progress bar */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
              <div className="h-full bg-primary-500 rounded transition-all duration-1000"
                style={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }} />
            </div>

            {statusSteps.map((step, idx) => {
              const isActive = idx <= currentIdx;
              return (
                <div key={step.status} className="relative flex flex-col items-center z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'bg-gray-200 text-gray-400'
                  } ${idx === currentIdx ? 'animate-status-pulse scale-110' : ''}`}>
                    {step.icon}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><span className="text-gray-500">Invoice:</span><br /><span className="font-semibold text-orange-600">{order.invoiceNumber || 'N/A'}</span></div>
          <div><span className="text-gray-500">Date:</span><br />{new Date(order.createdAt).toLocaleString()}</div>
          <div><span className="text-gray-500">Payment:</span><br />{order.paymentMethod === 'COD' ? 'Pay at Counter' : 'Online'}</div>
          <div><span className="text-gray-500">Customer:</span><br />{order.user?.name || 'N/A'}</div>
        </div>

        <h3 className="font-semibold text-gray-700 mt-4 mb-2">Items</h3>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-gray-700">{item.name} × {item.quantity}</span>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-xl">
          <span className="font-bold">Total</span>
          <span className="font-extrabold text-primary-600">₹{order.totalPrice}</span>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Status History</h2>
          <div className="space-y-3">
            {order.statusHistory.map((sh, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                <span className="font-medium text-gray-700">{sh.status}</span>
                <span className="text-gray-400 text-sm ml-auto">{new Date(sh.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
