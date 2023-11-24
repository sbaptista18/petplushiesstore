let webpack = require("webpack");
let path = require("path");

const DotEnv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const distDir = path.join(__dirname, "../dist");
const srcDir = path.join(__dirname, "../src");

module.exports = {
  output: {
    path: distDir,
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "~": path.resolve(__dirname, srcDir),
      assets: path.resolve(__dirname, `${srcDir}/assets`),
      components: path.resolve(__dirname, `${srcDir}/components`),
      constants: path.resolve(__dirname, `${srcDir}/constants`),
      contracts: path.resolve(__dirname, `${srcDir}/contracts`),
      fragments: path.resolve(__dirname, `${srcDir}/fragments`),
      layout: path.resolve(__dirname, `${srcDir}/layout`),
      pages: path.resolve(__dirname, `${srcDir}/pages`),
      services: path.resolve(__dirname, `${srcDir}/services`),
      reducers: path.resolve(__dirname, `${srcDir}/reducers`),
    },
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|gif|jp(e*)g)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(svg|md)$/,
        exclude: /node_modules/,
        use: ["file-loader"],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.mp4$/,
        use: "file-loader?name=videos/[name].[ext]",
      },
    ],
  },
  plugins: [
    new DotEnv({
      path: ".env",
    }),
    new webpack.ProvidePlugin({
      React: "react",
      _: "lodash",
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new CopyPlugin({
      patterns: [{ from: "./src/assets/images", to: "./public/images" }],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
