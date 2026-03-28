import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phone: user?.phone || '',
    paymentMethod: 'COD',
    note: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty!');
    if (!form.phone) return toast.error('Please enter your phone number');

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
        deliveryAddress: form.note || 'Canteen Pickup',
        phone: form.phone,
        paymentMethod: form.paymentMethod,
      };
      const { data } = await API.post('/orders', orderData);
      clearCart();
      toast.success('Order placed! Your invoice is ready 🧾');
      navigate(`/order/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Your Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input type="text" value={user?.name || ''} disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Enter your phone number" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
              <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. Less spicy, extra sauce..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                <option value="COD">💵 Pay at Counter</option>
                <option value="Online">💳 Online Payment</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-primary-200 active:scale-[0.98]">
            {loading ? 'Placing Order...' : `Place Order • ₹${cartTotal}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{item.image || '🍽️'}</span>
                  <span className="text-sm text-gray-700">{item.name} × {item.quantity}</span>
                </div>
                <span className="text-sm font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-primary-600">₹{cartTotal}</span>
          </div>
          <div className="mt-4 bg-orange-50 rounded-xl p-3 text-sm text-orange-700">
            🧾 An invoice with a unique ID will be generated after you place the order.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
