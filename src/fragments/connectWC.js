import WooCommerceAPI from "react-native-woocommerce-api";

const wcUrl = process.env.WC_URL;
const wcCK = process.env.WC_CONSUMER_KEY;
const wcCS = process.env.WC_CONSUMER_SECRET;
const wcVersion = process.env.WC_VERSION;

const ConnectWC = new WooCommerceAPI({
  url: wcUrl, // Your store URL
  ssl: true,
  consumerKey: wcCK, // Your consumer secret
  consumerSecret: wcCS, // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: wcVersion, // WooCommerce WP REST API version
  queryStringAuth: true,
});

export default ConnectWC;
