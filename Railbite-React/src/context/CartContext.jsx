import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('railbiteCart');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    localStorage.setItem('railbiteCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (name, price, image = null) => {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: Date.now(),
        name,
        price,
        quantity: 1,
        image
      }]);
    }
    
    showToast(`${name} added to cart!`);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (itemId, change) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(itemId);
      } else {
        setCart(cart.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('railbiteCart');
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      toast
    }}>
      {children}
    </CartContext.Provider>
  );
};
