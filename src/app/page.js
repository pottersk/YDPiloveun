'use client';
import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

function ProductList({ products, visibleProducts }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`transform transition-all duration-500 ${
            visibleProducts.includes(index)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <ProductCard product={product} priority={index < 4} />
        </div>
      ))}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  const categories = [
    { id: '', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'jewelery', name: 'Jewelry' },
    { id: "men's clothing", name: "Men's Clothing" },
    { id: "women's clothing", name: "Women's Clothing" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setVisibleProducts([]); 
      try {
        let url = 'https://fakestoreapi.com/products';
        
        if (currentCategory) {
          url = `https://fakestoreapi.com/products/category/${currentCategory}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(allProducts);
    } else {
      const searchLower = searchQuery.toLowerCase();
      const filtered = allProducts.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(searchLower);
        const descMatch = product.description.toLowerCase().includes(searchLower);
        const categoryMatch = product.category.toLowerCase().includes(searchLower);
        return titleMatch || descMatch || categoryMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      setVisibleProducts([]);
      const timeouts = [];
      
      filteredProducts.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setVisibleProducts(prev => [...prev, index]);
        }, index * 100);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [loading, filteredProducts]);

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId === '') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    if (searchInput) {
      params.set('search', searchInput);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
    setShowFilters(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const getItemCountText = (count) => {
    return count === 1 ? 'item' : 'items';
  };

  const getCategoryTitle = () => {
    if (!currentCategory) return 'All Products';
    return currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
  };

  const getCategoryButtonClass = (categoryId) => {
    const baseClass = 'w-full text-left px-4 py-2.5 transition-all duration-200 font-medium text-sm hover:translate-x-1';
    if (currentCategory === categoryId) {
      return `${baseClass} bg-slate-100 text-slate-900`;
    }
    return `${baseClass} text-slate-700 hover:bg-slate-50`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100/40 animate-fadeIn">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-sm animate-pulse">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/40 pt-20 md:pt-32 pb-12">
      <div className="container mx-auto px-8 md:px-11">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="text-left">
            <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">
              {getCategoryTitle()}
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              {filteredProducts.length} {getItemCountText(filteredProducts.length)} available
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium text-sm transition-colors duration-200 shadow-sm"
              >
                <span>Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-slideUp">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={getCategoryButtonClass(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="w-80">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-colors font-medium text-sm bg-white shadow-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="animate-fadeIn">
            <ProductList products={filteredProducts} visibleProducts={visibleProducts} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm md:shadow-md animate-fadeIn">
            <svg
              className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mb-3 md:mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg md:text-xl font-medium text-slate-700 mb-2">No Products Found</h3>
            <p className="text-slate-500 text-xs md:text-sm">Try selecting a different category or adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-black border-t-transparent animate-spin"></div>
          <p className="text-gray-900 font-light tracking-widest uppercase text-sm">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}