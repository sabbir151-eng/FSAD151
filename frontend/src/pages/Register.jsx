import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', canteenName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (activeTab === 'admin' && !form.canteenName) return toast.error('Please enter canteen name');
    if (activeTab === 'admin' && !form.phone) return toast.error('Please enter phone number');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone, form.address, activeTab === 'admin' ? 'admin' : undefined, form.canteenName);
      toast.success('Account created successfully! 🎉');
      navigate(activeTab === 'admin' ? '/admin/dashboard' : '/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍽️</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Join Campus Canteen</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setActiveTab('customer'); setForm({ name: '', email: '', password: '', phone: '', address: '', canteenName: '' }); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'customer'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            🎓 Student
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setForm({ name: '', email: '', password: '', phone: '', address: '', canteenName: '' }); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            🏪 Canteen Staff
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          {activeTab === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canteen / Restaurant Name</label>
              <input type="text" value={form.canteenName} onChange={update('canteenName')} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. Campus Canteen" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{activeTab === 'admin' ? 'Staff Name' : 'Full Name'}</label>
            <input type="text" value={form.name} onChange={update('name')} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder={activeTab === 'admin' ? 'Staff Name' : 'Your Name'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={update('email')} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={form.password} onChange={update('password')} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={form.phone} onChange={update('phone')} required={activeTab === 'admin'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="9876543210" />
          </div>
          {activeTab === 'customer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel / Block (Optional)</label>
              <input type="text" value={form.address} onChange={update('address')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. Hostel Block A" />
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary-200">
            {loading ? 'Creating Account...' : activeTab === 'admin' ? '🏪 Register Canteen' : '🎓 Create Student Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
