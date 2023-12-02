import { ConnectWC } from "fragments";

export const fetchCartId = async (cartId) => {
  ConnectWC.get("temp_carts")
    .then((data) => {
      const cartLocalSession = data.success.find((cart) => cart.id === cartId);
      if (cartLocalSession !== undefined) {
        fetchCartProducts(cartLocalSession.id);
      } else {
        setLoading(false);
      }
    })
    .catch((error) => {
      setError(true);
    });
};

export const fetchCartProducts = async (cartId) => {
  ConnectWC.get("temp_cart_products_id/" + cartId)
    .then((data) => {
      if (data.results.length > 0) {
        setProductsCart(data.results);
        fetchProducts(data.results);
      } else {
        setProductsCart([]);
        setProducts([]);
      }
    })
    .catch((error) => {
      setError(true);
    });
};

export const fetchProducts = (data) => {
  const promises = data.map((cartItem) => {
    return ConnectWC.get("products/" + cartItem.product_id)
      .then((product) => ({ cartItem, product }))
      .catch((error) => {
        return { error: error.response.data };
      });
  });

  Promise.all(promises)
    .then((responses) => {
      const combinedProducts = responses.map(({ cartItem, product }) => ({
        ...cartItem,
        product,
      }));
      setProductsCart(data);
      setProducts(combinedProducts);
      setLoading(false);
    })
    .catch((error) => {
      setError(true);
      setProducts([]);
    });
};
