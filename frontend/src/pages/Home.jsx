import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import FoodCard from '../components/FoodCard';
import { FiArrowRight, FiCoffee, FiClock, FiShield } from 'react-icons/fi';

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await API.get('/analytics/popular?limit=8');
        setPopular(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPopular();
  }, []);

  const features = [
    { icon: <FiCoffee className="text-3xl" />, title: 'Fresh Food', desc: 'Freshly prepared meals from our canteen' },
    { icon: <FiClock className="text-3xl" />, title: 'Quick Pickup', desc: 'Order ahead and skip the queue' },
    { icon: <FiShield className="text-3xl" />, title: 'Easy Payment', desc: 'Pay at counter or online' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              College Canteen,{' '}
              <span className="gradient-text">Order Easy</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Skip the queue! Order from your college canteen, get an invoice, and pick up your food when it's ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/menu" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:shadow-primary-200 flex items-center gap-2 active:scale-95">
                Order Now <FiArrowRight />
              </Link>
              <Link to="/menu" className="text-gray-700 hover:text-primary-500 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-primary-300 transition-all">
                Browse Menu
              </Link>
            </div>
          </div>

          {/* Floating food emojis */}
          <div className="absolute top-10 left-10 text-5xl animate-bounce opacity-50">🍛</div>
          <div className="absolute top-20 right-16 text-4xl animate-bounce opacity-50" style={{ animationDelay: '0.5s' }}>☕</div>
          <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce opacity-50" style={{ animationDelay: '1s' }}>🥟</div>
          <div className="absolute bottom-20 right-1/4 text-5xl animate-bounce opacity-50" style={{ animationDelay: '1.5s' }}>🍫</div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center card-hover">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-500 mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-800">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">🔥 Popular Dishes</h2>
            <p className="text-gray-500 mt-1">Most loved by students</p>
          </div>
          <Link to="/menu" className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 transition-colors">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-primary-500 to-red-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">Hungry? Order from the Canteen!</h2>
          <p className="mt-3 text-lg opacity-90">Browse the menu, place your order, get an invoice & pick up when ready</p>
          <Link to="/menu" className="inline-flex items-center gap-2 mt-6 bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all active:scale-95">
            Explore Menu <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
