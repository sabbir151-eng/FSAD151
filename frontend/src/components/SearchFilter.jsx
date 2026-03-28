import { FiSearch } from 'react-icons/fi';

const categories = [
  { value: '', label: 'All', emoji: '🍽️' },
  { value: 'veg', label: 'Veg', emoji: '🥗' },
  { value: 'non-veg', label: 'Non-Veg', emoji: '🍗' },
  { value: 'snacks', label: 'Snacks', emoji: '🍟' },
  { value: 'desserts', label: 'Desserts', emoji: '🍰' },
  { value: 'beverages', label: 'Beverages', emoji: '🥤' },
  { value: 'main-course', label: 'Main Course', emoji: '🍛' },
];

const SearchFilter = ({ search, setSearch, category, setCategory, sort, setSort, minPrice, setMinPrice, maxPrice, setMaxPrice }) => {
  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white">
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="popularity">Most Popular</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
