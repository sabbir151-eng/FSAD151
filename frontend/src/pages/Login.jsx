import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.name}! 🎉`);
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍽️</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Campus Canteen</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setActiveTab('customer'); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'customer'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            🎓 Student
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            🏪 Canteen Staff
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder={activeTab === 'admin' ? 'canteen@email.com' : 'student@email.com'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary-200">
            {loading ? 'Signing in...' : activeTab === 'admin' ? '🏪 Sign In as Staff' : '🎓 Sign In as Student'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">Sign Up</Link>
        </p>

        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-semibold mb-1">Demo Accounts:</p>
          <p>🏪 Canteen Staff: admin@canteen.com / admin123</p>
          <p>🎓 Student: john@example.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
