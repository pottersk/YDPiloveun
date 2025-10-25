'use client';

import { useCart } from '@/context/CartContext';
import { useState, Suspense, useMemo } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function HeaderContent() {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = useMemo(() => [
    { id: '', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'jewelery', name: 'Jewelry' },
    { id: "men's clothing", name: "Men's Clothing" },
    { id: "women's clothing", name: "Women's Clothing" }
  ], []);
  
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId === '') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
    setShowFilters(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const getCurrentCategoryName = () => {
    const current = categories.find(cat => cat.id === activeCategory);
    return current ? current.name : 'All Products';
  };

  const getCategoryButtonClass = (categoryId) => {
    const baseClass = 'w-full text-left px-3 py-2 transition-all duration-200 mb-1 font-medium text-sm hover:translate-x-1';
    if (activeCategory === categoryId) {
      return `${baseClass} bg-slate-100 text-slate-900`;
    }
    return `${baseClass} text-slate-700 hover:bg-slate-50`;
  };

  const getIconButtonClass = (isMobile = false) => {
    if (isMobile) {
      return 'relative p-1 text-gray-700 hover:text-pink-500 transition-colors';
    }
    return 'relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95';
  };

  const getBadgeClass = (isMobile = false, isWishlist = false) => {
    const baseClass = 'absolute -top-1 -right-1 flex items-center justify-center rounded-full text-xs font-medium text-white';
    const sizeClass = isMobile ? 'h-4 w-4 font-bold' : 'h-5 w-5';
    const colorClass = isWishlist ? 'bg-rose-500' : 'bg-slate-800';
    const animationClass = isMobile ? '' : 'animate-pulse';
    
    return `${baseClass} ${sizeClass} ${colorClass} ${animationClass} transition-all duration-200`;
  };
  
  return (
    <header className="w-full fixed top-0 z-10 p-2 md:p-5">
      <nav className="container mx-auto">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-4">
            
            <div className="hidden md:flex w-full items-center justify-between">
              <Link href="/" className="font-semibold text-2xl text-slate-800 hover:text-slate-900 transition-colors">
                YDP Shop
              </Link>

              <div className="flex items-center space-x-2">
                <a 
                  href="https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={getIconButtonClass()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </a>
                
                <Link href="/wishlist" className={getIconButtonClass()}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  {wishlistItems?.length > 0 && (
                    <span className={getBadgeClass(false, true)}>
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                
                <Link href="/cart" className={getIconButtonClass()}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className={getBadgeClass(false, false)}>
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="flex md:hidden items-center justify-between w-full">
              <div className="w-[40px] flex justify-start">
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="p-1 text-gray-700 hover:text-pink-500 transition-colors"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {open ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
              
              <Link href="/" className="font-semibold text-xl text-slate-800 hover:text-slate-900 transition-colors">
                YDP Shop
              </Link>
              
              <div className="flex items-center gap-2">
                <Link href="/wishlist" className={getIconButtonClass(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  {wishlistItems?.length > 0 && (
                    <span className={getBadgeClass(true, true)}>
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                
                <Link href="/cart" className={getIconButtonClass(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className={getBadgeClass(true, false)}>
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 md:hidden mx-2 animate-slideUp">
            <div className="p-3 flex flex-col gap-2">
              <div className="border-b border-slate-200 pb-2 mb-2">
                <p className="text-xs font-semibold text-slate-500 px-3 mb-2 uppercase tracking-wider">Categories</p>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryClick(category.id);
                      setOpen(false);
                    }}
                    className={getCategoryButtonClass(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <Link
                href="https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1"
                onClick={() => setOpen(false)}
                className="text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium text-sm hover:translate-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span>Profile</span>
              </Link>
              
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium text-sm hover:translate-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <span>Wishlist</span>
              </Link>
              
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium text-sm hover:translate-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

const Header = () => {
  return (
    <Suspense fallback={<div className="w-full h-16 bg-white/90 backdrop-blur-sm rounded-full border border-gray-100 shadow-lg"></div>}>
      <HeaderContent />
    </Suspense>
  );
};

export default Header;