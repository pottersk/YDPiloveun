'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import AddToCartModal from '@/components/AddToCartModal';

export default function ProductPage() { 
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`, { 
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        if (!abortController.signal.aborted) {
          setProduct(data);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching product:', error);
        }
      } finally {
        if (!abortController.signal.aborted) { 
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => abortController.abort();
  }, [params.id]);

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  //เพิ่มสินค้าลงตะกร้าตามจำนวนที่ระบุ
  const handleAddToCart = (product, quantity) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const getWishlistButtonClass = () => {
    const base = 'px-4 md:px-6 rounded-lg border-2 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95';

    if (product && isInWishlist(product.id)) {
      return `${base} bg-rose-50 border-rose-500 text-rose-500 hover:bg-rose-100`;
    }
    return `${base} bg-white border-slate-300 text-slate-600 hover:border-rose-500 hover:text-rose-500`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fadeIn">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  //ถ้าไม่พบสินค้าให้แสดงข้อความแจ้งเตือน
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const isInUserWishlist = isInWishlist(product.id);

  return (
    <>
      <div className="min-h-screen bg-white pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-4 md:py-12">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-10 shadow-lg md:shadow-xl border border-slate-200/50 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6 md:gap-12">
              <div className="flex items-center justify-center">
                <div className="relative w-full h-64 md:h-96 bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm md:shadow-md border border-slate-100 md:border-2 transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'contain', padding: '20px' }}
                    priority
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="inline-block w-fit px-3 py-1.5 rounded bg-slate-100 text-slate-600 text-xs md:text-sm font-medium mb-3 md:mb-6 border border-slate-200">
                  {product.category}
                </span>
                
                <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-6 leading-tight">
                  {product.title}
                </h1>
                
                <p className="text-slate-600 mb-4 md:mb-8 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-amber-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-slate-800 text-base md:text-lg">
                    {product.rating?.rate.toFixed(1)}
                  </span>
                  <span className="text-slate-600 font-medium md:font-bold text-xs md:text-sm">
                    ({product.rating?.count} reviews)
                  </span>
                </div>
                
                <div className="text-3xl md:text-5xl font-bold text-slate-800 mb-5 md:mb-10">
                  ${product.price.toFixed(2)}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white py-3 md:py-4 font-medium text-sm md:text-base transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                  >
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    className={getWishlistButtonClass()}
                    aria-label={isInUserWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    {isInUserWishlist ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
          onAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
}