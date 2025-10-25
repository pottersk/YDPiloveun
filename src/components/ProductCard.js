'use client';
import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import AddToCartModal from '@/components/AddToCartModal';

const ProductCard = ({ product, priority = false }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inWishlist = useMemo(() => isInWishlist(product.id), [isInWishlist, product.id]);

  const formattedPrice = useMemo(() => product.price.toFixed(2), [product.price]);
  const formattedRating = useMemo(() => product.rating.rate.toFixed(1), [product.rating.rate]);

  const handleWishlistClick = useCallback((e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [inWishlist, product, removeFromWishlist, addToWishlist]);

  const handleAddToCartClick = useCallback((e) => {
    e.preventDefault();
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddToCart = useCallback((product, quantity) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  }, [addToCart]);

  const getWishlistIconClass = () => {
    const baseClass = 'w-4 h-4 md:w-5 md:h-5';
    if (inWishlist) {
      return `${baseClass} text-rose-500`;
    }
    return `${baseClass} text-slate-400 hover:text-rose-500`;
  };

  const renderWishlistIcon = () => {
    if (inWishlist) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={getWishlistIconClass()}>
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={getWishlistIconClass()}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    );
  };

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group relative block overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 h-full">       
          <div className="relative h-48 md:h-64 w-full overflow-hidden bg-white p-3 md:p-4">
            <button
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 md:top-3 md:right-3 z-10 p-1.5 md:p-2 rounded-lg bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
              aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {renderWishlistIcon()}
            </button>
            
            <div className="absolute inset-3 md:inset-4 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="transition-transform duration-300 ease-out group-hover:scale-105"
                  priority={priority}
                />
              </div>
            </div>
            
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-10">
              <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-medium text-slate-600 border border-slate-200">
                {product.category}
              </span>
            </div>
            
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4 text-amber-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-slate-800">
                {formattedRating}
              </span>
            </div>
          </div>

          <div className="relative p-3 md:p-4 bg-white">
            <div className="min-h-[2.5rem] md:min-h-[3rem] mb-2 md:mb-3">
              <h3 className="text-sm md:text-base font-medium text-slate-900 line-clamp-2 leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                {product.title}
              </h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-base md:text-xl font-semibold text-slate-800">
                  ${formattedPrice}
                </p>
                <button
                  onClick={handleAddToCartClick}
                  className="flex items-center gap-1 md:gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="hidden md:inline">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={product}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductCard;