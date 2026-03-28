import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import Dashboard from './pages/admin/Dashboard';
import ManageMenu from './pages/admin/ManageMenu';
import ManageOrders from './pages/admin/ManageOrders';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="spinner"></div></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Home - redirect admin to orders page */}
          <Route path="/" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <Home />} />

          {/* Student-only routes - redirect admin away */}
          <Route path="/menu" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <Menu />} />
          <Route path="/cart" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <Cart />} />
          <Route path="/checkout" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/my-orders" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

          {/* Auth routes */}
          <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin/orders' : '/menu'} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={isAdmin ? '/admin/orders' : '/menu'} replace /> : <Register />} />

          {/* Admin routes - Canteen Staff only */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute adminOnly><ManageMenu /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
