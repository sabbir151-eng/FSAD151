import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import FoodCard from '../components/FoodCard';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 12, sort });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const { data } = await API.get(`/menu?${params}`);
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, category, sort, minPrice, maxPrice, currentPage]);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { setCurrentPage(1); }, [search, category, sort, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">🍽️ Our Menu</h1>
        <p className="text-gray-500 mt-2">Browse from {totalItems} delicious dishes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilter
            search={search} setSearch={setSearch}
            category={category} setCategory={setCategory}
            sort={sort} setSort={setSort}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-20"><div className="spinner"></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">🔍</span>
              <p className="text-xl text-gray-500 mt-4">No items found</p>
              <p className="text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => <FoodCard key={item._id} item={item} />)}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
