import React, { createContext, useReducer, useContext, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...state, { ...action.payload, addedAt: Date.now() }];
    // ... other cases for updating the cart
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    // Remove items from the cart that have exceeded the time limit (e.g., 20 mins)
    const now = Date.now();
    const updatedCart = cart.filter(
      (item) => now - item.addedAt <= 20 * 60 * 1000
    );

    // Dispatch an action to update the cart state
    dispatch({ type: "SET_CART", payload: updatedCart });
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
