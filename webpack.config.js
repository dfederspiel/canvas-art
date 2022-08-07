const { resolve } = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebPackPlugin({
      template: resolve(__dirname, "./public", "index.html"),
      // favicon: resolve(__dirname, '../public', 'favicon.ico'),
      filename: "./index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/images", to: "images" },
        { from: "public/styles.css", to: "styles.css" },
      ],
    }),
  ],
};
