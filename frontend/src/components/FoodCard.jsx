import { useCart } from '../context/CartContext';
import { FiPlus, FiStar } from 'react-icons/fi';

const categoryColors = {
  'veg': 'bg-green-100 text-green-700',
  'non-veg': 'bg-red-100 text-red-700',
  'desserts': 'bg-pink-100 text-pink-700',
  'beverages': 'bg-blue-100 text-blue-700',
  'snacks': 'bg-yellow-100 text-yellow-700',
  'main-course': 'bg-purple-100 text-purple-700',
};

const FoodCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md card-hover overflow-hidden group">
      {/* Image/Emoji area */}
      <div className="h-40 bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center relative">
        <span className="text-6xl group-hover:scale-125 transition-transform duration-300">{item.image || '🍽️'}</span>
        {!item.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-lg leading-tight">{item.name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${categoryColors[item.category] || 'bg-gray-100 text-gray-700'}`}>
            {item.category}
          </span>
        </div>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>

        <div className="flex items-center gap-2 mt-2">
          {item.rating > 0 && (
            <span className="flex items-center gap-1 text-sm text-yellow-500">
              <FiStar className="fill-yellow-400" /> {item.rating}
            </span>
          )}
          <span className="text-xs text-gray-400">({item.orderCount} orders)</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-2xl font-bold text-primary-600">₹{item.price}</span>
          <button
            onClick={() => addToCart(item)}
            disabled={!item.availability}
            className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-200 active:scale-95"
          >
            <FiPlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
