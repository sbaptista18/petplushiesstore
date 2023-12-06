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

app.use(express.json());

// GET FUNCTIONS
app.get("/products", (req, res) => {
  ConnectWC.get("products")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/products/id", (req, res) => {
  const productId = req.query.id; // This retrieves the cartId from the query parameters
  ConnectWC.get("products/" + productId)
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

app.get("/temp_cart_products", (req, res) => {
  const prodId = req.query.prodId; // This retrieves the cartId from the query parameters

  ConnectWC.get("temp_cart_products/" + prodId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/customers", (req, res) => {
  const userId = req.query.userId; // This retrieves the cartId from the query parameters

  ConnectWC.get("customers/" + userId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/shipping", (req, res) => {
  const area = req.query.area; // This retrieves the cartId from the query parameters

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

  ConnectWC.post("temp_cart_products_checkout/", dataProduct)
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

app.listen(8000, () => console.log(`App started on PORT ${PORT}`));
