const express = require("express");
const WooCommerceAPI = require("react-native-woocommerce-api");
const PORT = 8000;
require("dotenv").config();

const app = express();

const wcUrl = process.env.WC_URL;
const wcCK = process.env.WC_CONSUMER_KEY;
const wcCS = process.env.WC_CONSUMER_SECRET;

const ConnectWC = new WooCommerceAPI({
  url: wcUrl, // Your store URL
  ssl: true,
  consumerKey: wcCK, // Your consumer secret
  consumerSecret: wcCS, // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v3", // WooCommerce WP REST API version
  queryStringAuth: true,
});

app.get("/products", (req, res) => {
  ConnectWC.get("products")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/products/categories", (req, res) => {
  ConnectWC.get("products/categories")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/temp_carts", (req, res) => {
  ConnectWC.get("temp_carts")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/temp_cart_products_id", (req, res) => {
  const cartId = req.query.cartId; // This retrieves the cartId from the query parameters

  ConnectWC.get("temp_cart_products_id/" + cartId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(8000, () => console.log(`App started on PORT ${PORT}`));
