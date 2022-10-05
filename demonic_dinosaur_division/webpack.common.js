// devtools
const path = require("path");
const { webpack, ProvidePlugin } = require("webpack");
// html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// dotenv
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "script.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  resolve: {
    alias: {
      Src: path.resolve(__dirname, "src"),
      Components: path.resolve(__dirname, "src/components"),
      Sections: path.resolve(__dirname, "src/sections"),
    },
    fallback: {
      stream: require.resolve("stream-browserify"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("stream-http"),
      buffer: require.resolve("buffer"),
    },
  },
};
