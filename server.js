const express = require("express");
const cors = require("cors");
const WooCommerceAPI = require("react-native-woocommerce-api");
const PORT = process.env.PORT;
require("dotenv").config();

const app = express();

const wcUrl = process.env.WC_URL;
const wcCK = process.env.WC_CONSUMER_KEY;
const wcCS = process.env.WC_CONSUMER_SECRET;

const ConnectWCV2 = new WooCommerceAPI({
  url: wcUrl, // Your store URL
  ssl: true,
  consumerKey: wcCK, // Your consumer secret
  consumerSecret: wcCS, // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v2", // WooCommerce WP REST API version
  queryStringAuth: true,
});

const ConnectWC = new WooCommerceAPI({
  url: wcUrl, // Your store URL
  ssl: true,
  consumerKey: wcCK, // Your consumer secret
  consumerSecret: wcCS, // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v3", // WooCommerce WP REST API version
  queryStringAuth: true,
});

app.use(express.json());

app.use(cors({ origin: "https://develop.petplushies.pt" }));

// GET FUNCTIONS
app.get("/products/page", (req, res) => {
  const page = req.query.page;
  ConnectWC.get("products", { per_page: 12, page: page })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/products", (req, res) => {
  ConnectWC.get("products", { per_page: 99 })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/products/id", (req, res) => {
  const productId = req.query.id; // This retrieves the productId from the query parameters
  ConnectWC.get("products/" + productId, { per_page: 99 })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/product/product_slug", (req, res) => {
  const productSlug = req.query.product_slug; // This retrieves the productSlug from the query parameters
  ConnectWC.get("products_list/" + productSlug, { per_page: 99 })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/product/product_id", (req, res) => {
  const productId = req.query.product_id; // This retrieves the productId from the query parameters
  ConnectWC.get("products_ids/" + productId, { per_page: 99 })
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

app.get("/temp_carts/session", (req, res) => {
  const id = req.query.id;

  ConnectWC.get(`temp_carts/session/${id}`)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/temp_carts/id", (req, res) => {
  const id = req.query.id;

  ConnectWC.get(`temp_carts/id/${id}`)
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

app.get("/temp_cart_products", (req, res) => {
  const prodId = req.query.prodId; // This retrieves the prodId from the query parameters

  ConnectWC.get("temp_cart_products/" + prodId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/customers", (req, res) => {
  const userId = req.query.userId; // This retrieves the userId from the query parameters

  ConnectWC.get("customers/" + userId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/shipping", (req, res) => {
  const area = req.query.area; // This retrieves the area from the query parameters

  ConnectWC.get(`shipping/zones/${area}/methods`)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/orders", (req, res) => {
  const id = req.query.id; // This retrieves the cartId from the query parameters

  ConnectWC.get(`orders/${id}`)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/orders/userid", (req, res) => {
  ConnectWC.get(`orders`)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/get_reviews", (req, res) => {
  const prodId = req.query.prodId;

  ConnectWCV2.get(`products/${prodId}/reviews`)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

// POST FUNCTIONS
app.post("/temp_cart_products_id", (req, res) => {
  const dataProduct = req.body.dataProduct;

  ConnectWC.post("temp_cart_products_checkout/", dataProduct)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/temp_cart_products", (req, res) => {
  const dataProduct = req.body.dataProduct;

  ConnectWC.post("temp_cart_products/", dataProduct)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/temp_carts", (req, res) => {
  const dataCart = req.body.dataCart;

  ConnectWC.post("temp_carts/", dataCart)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/orders", (req, res) => {
  const dataOrder = req.body.dataOrder;

  ConnectWC.post("orders/", dataOrder)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/customers", (req, res) => {
  const dataCustomer = req.body.dataCustomer;

  ConnectWC.post("customers/", dataCustomer)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/reviews", (req, res) => {
  const reviewData = req.body.reviewData;

  ConnectWC.post("products/reviews/", reviewData)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

// DELETE FUNCTIONS
app.delete("/temp_cart_products_delete", (req, res) => {
  const cartId = req.query.cartId;
  const prodId = req.query.prodId;

  ConnectWC.delete(`temp_cart_products_delete/${cartId}/${prodId}`)
    .then((response) => {
      res.json({ message: "Product deleted from cart successfully!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.delete("/temp_cart_delete_on_order", (req, res) => {
  const cartId = req.query.cartId;

  ConnectWC.delete(`temp_cart_delete_on_order/${cartId}`)
    .then((response) => {
      res.json({ message: "Cart deleted from cart successfully!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// PUT FUNCTIONS
app.put("/users/id", (req, res) => {
  const userId = req.query.userId;
  const email = req.body.data.user_email;

  ConnectWC.put(`users/${userId}`, email)
    .then((response) => {
      res.json({ message: "Data updated successfully!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/customers/id", (req, res) => {
  const userId = req.query.userId;
  const dataUser = req.body.dataUser;

  ConnectWC.put(`customers/${userId}`, dataUser)
    .then((response) => {
      res.json({ message: "Data updated successfully!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(PORT, "0.0.0.0", () => console.log(`App started on PORT ${PORT}`));
