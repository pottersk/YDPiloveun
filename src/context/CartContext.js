'use client';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

//สร้าง Context สำหรับตะกร้าสินค้า
const CartContext = createContext();

export function CartProvider({ children }) {
  //state เก็บรายการสินค้าในตะกร้า
  const [cartItems, setCartItems] = useState([]);

  //โหลดข้อมูลตะกร้าจาก localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  //บันทึกข้อมูลตะกร้าลง localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  //เพิ่มสินค้าลงตะกร้า
  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  //ลบสินค้าออกจากตะกร้า
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  //ล้างตะกร้าสินค้าทั้งหมด
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  //คำนวณราคารวมทั้งหมด
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cartItems]);

  //คำนวณจำนวนสินค้าทั้งหมด
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice: () => totalPrice,
    getTotalItems: () => totalItems,
    clearCart,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}