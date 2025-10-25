'use client';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { useMemo } from 'react';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  const itemCount = useMemo(() => wishlistItems.length, [wishlistItems.length]);

  const getItemText = (count) => {
    return count === 1 ? 'item' : 'items';
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-slate-100/40 pt-20 md:pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-6 md:mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2">
              My Wishlist
            </h1>
            <p className="text-slate-600 text-xs md:text-sm">0 items saved</p>
          </div>

          <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md border border-slate-200 animate-fadeIn">
            <svg className="w-16 h-16 md:w-24 md:h-24 text-slate-300 mb-4 md:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2 md:mb-3">Your wishlist is empty</h3>
            <p className="text-slate-600 text-sm md:text-base">Save items you love for later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/40 pt-20 md:pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <div className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2">
            My Wishlist
          </h1>
          <p className="text-slate-600 text-xs md:text-sm">
            {itemCount} {getItemText(itemCount)} saved
          </p>
        </div>

        <div className="animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="transition-all duration-300 hover:scale-105">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}