import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [sessionKey, setSessionKey] = useState(null);
  const [cartId, setCartId] = useState(null);

  const [productsNr, setProductsNr] = useState(0);

  const setSessionKeyAndCartId = (sessionKey, cartId) => {
    setSessionKey(sessionKey);
    setCartId(cartId);
  };

  const updateProductsNr = (newProductsNr) => {
    setProductsNr(newProductsNr);
  };

  return (
    <CartContext.Provider
      value={{
        sessionKey,
        cartId,
        setSessionKeyAndCartId,
        productsNr,
        updateProductsNr,
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
