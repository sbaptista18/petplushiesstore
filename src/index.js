import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { CartProvider } from "reducers";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <CartProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CartProvider>
);
