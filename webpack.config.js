const { resolve } = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
      path: `${__dirname}/dist`,
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebPackPlugin({
            template: resolve(__dirname, './public', 'index.html'),
            // favicon: resolve(__dirname, '../public', 'favicon.ico'),
            filename: './index.html',
          }),
    ]
  };