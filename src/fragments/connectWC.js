// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// const ConnectWC = new WooCommerceRestApi({
//   url: "http://backoffice.petplushies.pt",
//   consumerKey: "ck_761d5704a30da818bfa5bc01020b54333efe25a5",
//   consumerSecret: "cs_5976b976107c62b0615e6b4b0ac1cd89e5dda288",
//   version: "wc/v3",
// });

import WooCommerceAPI from "react-native-woocommerce-api";

const ConnectWC = new WooCommerceAPI({
  url: "https://backoffice.petplushies.pt", // Your store URL
  ssl: true,
  consumerKey: "ck_761d5704a30da818bfa5bc01020b54333efe25a5", // Your consumer secret
  consumerSecret: "cs_5976b976107c62b0615e6b4b0ac1cd89e5dda288", // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v3", // WooCommerce WP REST API version
  queryStringAuth: true,
});

export default ConnectWC;
