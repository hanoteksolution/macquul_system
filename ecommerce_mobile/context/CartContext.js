import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart and wishlist on app start
  useEffect(() => {
    loadCartAndWishlist();
  }, []);

  const loadCartAndWishlist = async () => {
    try {
      const [cartData, wishlistData] = await AsyncStorage.multiGet(['cart', 'wishlist']);
      
      const parsedCart = cartData[1] ? JSON.parse(cartData[1]) : [];
      const parsedWishlist = wishlistData[1] ? JSON.parse(wishlistData[1]) : [];
      
      setCart(parsedCart);
      setWishlist(parsedWishlist);
    } catch (error) {
      console.error('Error loading cart and wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const existingItem = cart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...cart, { ...product, quantity }];
      }
      
      setCart(newCart);
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const newCart = cart.filter(item => item.id !== productId);
      setCart(newCart);
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        return await removeFromCart(productId);
      }

      const newCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      
      setCart(newCart);
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      await AsyncStorage.setItem('cart', JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const addToWishlist = async (product) => {
    try {
      const isInWishlist = wishlist.some(item => item.id === product.id);
      let newWishlist;
      
      if (isInWishlist) {
        newWishlist = wishlist.filter(item => item.id !== product.id);
      } else {
        newWishlist = [...wishlist, product];
      }
      
      setWishlist(newWishlist);
      await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return !isInWishlist; // Return true if added, false if removed
    } catch (error) {
      console.error('Error updating wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (product) => {
    try {
      const newWishlist = wishlist.filter(item => item.id !== product.id);
      setWishlist(newWishlist);
      await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartTotal,
    getCartItemCount,
    refreshCart: loadCartAndWishlist,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
