'use client';
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AddToCartModal({ isOpen, onClose, product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  const totalPrice = useMemo(() => {
    if (!product) return '0.00';
    return (product.price * quantity).toFixed(2);
  }, [product, quantity]);

  if (!isOpen || !product || !mounted) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleCheckout = () => {
    onAddToCart(product, quantity);
    router.push('/cart');
    onClose();
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getQuantityButtonClass = (isDisabled = false) => {
    const baseClass = 'w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 transition-all duration-200';
    if (isDisabled) {
      return `${baseClass} opacity-40 cursor-not-allowed`;
    }
    return `${baseClass} hover:bg-gray-50 hover:scale-110 active:scale-95`;
  };

  const getRatingDisplay = () => {
    if (!product.rating) return null;
    return `${product.rating.rate} (${product.rating.count})`;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp">
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white border-b border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Add to Cart</h2>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded p-4 mb-5 border border-gray-200">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded p-2 border border-gray-200">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {product.category}
                  </p>
                  {product.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-700">
                        {product.rating.rate}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({product.rating.count})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={getQuantityButtonClass(quantity <= 1)}
                >
                  −
                </button>
                
                <span className="text-base font-medium text-gray-900 min-w-[2rem] text-center transition-all duration-200">
                  {quantity}
                </span>

                <button
                  onClick={incrementQuantity}
                  className={getQuantityButtonClass()}
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-sm text-gray-900">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Quantity</span>
                <span className="text-sm text-gray-900">× {quantity}</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-xl font-semibold text-gray-900">
                    ${totalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2.5 px-4 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                Add to Cart
              </button>

              <button
                onClick={handleCheckout}
                className="flex-1 py-2.5 px-4 rounded bg-slate-800 text-sm font-medium text-white hover:bg-slate-900 transition-all duration-200 hover:scale-105"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
