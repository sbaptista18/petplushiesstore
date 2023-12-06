import WooCommerceAPI from "react-native-woocommerce-api";
import axios from "axios";
import addOAuthInterceptor from "axios-oauth-1.0a";

// Create a client whose requests will be signed
const client = axios.create();

const wcUrl = process.env.WC_URL;
const wcCK = process.env.WC_CONSUMER_KEY;
const wcCS = process.env.WC_CONSUMER_SECRET;

// Specify the OAuth options
const options = {
  algorithm: "HMAC-SHA1",
  key: wcCK,
  secret: wcCS,
};

// Add interceptor that signs requests
addOAuthInterceptor(client, options);

// const ConnectWC = axios.create(
//   {
//     baseURL: wcUrl + "/wp-json/wc/v3",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   },
//   options
// );

const ConnectWC = new WooCommerceAPI({
  url: wcUrl, // Your store URL
  ssl: true,
  consumerKey: wcCK, // Your consumer secret
  consumerSecret: wcCS, // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: "wc/v3", // WooCommerce WP REST API version
  queryStringAuth: true,
});

export default ConnectWC;
