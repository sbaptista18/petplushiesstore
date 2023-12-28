import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [sessionKey, setSessionKey] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [productsNr, setProductsNr] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true" || false
  );

  const setSessionKeyAndCartId = (sessionKey, cartId) => {
    setSessionKey(sessionKey);
    setCartId(cartId);
  };

  const updateProductsNr = (newProductsNr) => {
    setProductsNr(newProductsNr);
  };

  const clearCartState = () => {
    setSessionKey(null);
    setCartId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userCart");
    setProductsNr(0);
    setIsLoggedIn(false); // Set isLoggedIn to false on logout
    localStorage.removeItem("isLoggedIn");
  };

  const setLoggedIn = (loggedIn) => {
    localStorage.setItem("isLoggedIn", Boolean(loggedIn));
    setIsLoggedIn(loggedIn);
  };

  // Use useEffect to update the state from localStorage on component mount
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  return (
    <CartContext.Provider
      value={{
        sessionKey,
        cartId,
        setSessionKeyAndCartId,
        productsNr,
        updateProductsNr,
        clearCartState,
        isLoggedIn, // Provide isLoggedIn in the context
        setLoggedIn, // Provide setLoggedIn function in the context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
