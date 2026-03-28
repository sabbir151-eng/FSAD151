import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-lg shadow-orange-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin/orders' : '/'} className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🍽️</span>
            <span className="text-xl font-bold gradient-text">Campus Canteen</span>
            {isAdmin && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">STAFF</span>}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* === STUDENT NAVIGATION === */}
            {!isAdmin && (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Home</Link>
                <Link to="/menu" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Menu</Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-500 transition-colors">
                  <FiShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {user && (
                  <Link to="/my-orders" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">My Orders</Link>
                )}
              </>
            )}

            {/* === CANTEEN STAFF NAVIGATION === */}
            {isAdmin && (
              <>
                <Link to="/admin/orders" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">📦 Incoming Orders</Link>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">📊 Dashboard</Link>
                <Link to="/admin/menu" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">🍽️ Manage Menu</Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <FiUser /> {user.name}
                  {isAdmin && user.canteenName && <span className="text-xs text-primary-500 ml-1">({user.canteenName})</span>}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-4">
            {!isAdmin && (
              <Link to="/cart" className="relative text-gray-700">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-700 text-2xl">
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAdmin ? (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">Home</Link>
                <Link to="/menu" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">Menu</Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">🛒 Cart ({cartCount})</Link>
                {user && (
                  <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">My Orders</Link>
                )}
              </>
            ) : (
              <>
                <Link to="/admin/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">📦 Incoming Orders</Link>
                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">📊 Dashboard</Link>
                <Link to="/admin/menu" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">🍽️ Manage Menu</Link>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-500 font-medium">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-500 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-primary-500 font-medium">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
