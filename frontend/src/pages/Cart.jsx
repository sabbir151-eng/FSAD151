import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-7xl">🛒</span>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some delicious items from our menu!</p>
        <Link to="/menu" className="inline-flex items-center gap-2 mt-6 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-medium transition-all">
          <FiShoppingBag /> Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🛒 Your Cart</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Clear All</button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 card-hover">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              {item.image || '🍽️'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
              <p className="text-primary-600 font-bold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <FiMinus className="text-sm" />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-600 flex items-center justify-center transition-colors">
                <FiPlus className="text-sm" />
              </button>
            </div>
            <div className="text-right min-w-[80px]">
              <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item._id)}
              className="text-red-400 hover:text-red-600 p-2 transition-colors">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center text-lg">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-gray-800">₹{cartTotal}</span>
        </div>
        <div className="flex justify-between items-center text-lg mt-2">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-bold text-green-500">Free</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between items-center text-xl">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-extrabold text-primary-600 text-2xl">₹{cartTotal}</span>
        </div>
        <Link to="/checkout"
          className="mt-6 block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-primary-200 active:scale-[0.98]">
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
};

export default Cart;
