import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { CartProvider } from "reducers";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
