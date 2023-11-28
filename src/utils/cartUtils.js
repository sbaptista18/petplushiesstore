import EventEmitter from "events";
const eventEmitter = new EventEmitter();

import { ConnectWC } from "fragments";

export const updateCartProducts = (cartId, product_id, qty, product_price) => {
  const dataProduct = {
    temp_cart_id: cartId,
    product_id: product_id,
    date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
    product_qty: qty,
    product_net_revenue: product_price * qty,
  };

  ConnectWC.post("temp_cart_products_checkout", dataProduct)
    .then((response) => {
      // Emit an object with state updates
      eventEmitter.emit("updateProductsNr", {
        qty,
        message: "Product updated!",
        status: "success",
        isModalOpen: true,
      });
    })
    .catch((error) => {
      // Emit an object with error state updates
      eventEmitter.emit("updateProductsNr", {
        qty: 0, // Or any other default value
        message: `Error updating product: ${error}`,
        status: "error",
        isModalOpen: true,
      });
    });
};

export const calculateTotalProducts = (products) => {
  return products.reduce(
    (sum, item) => sum + parseInt(item.product_qty, 10),
    0
  );
};
