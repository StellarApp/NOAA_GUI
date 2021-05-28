// const api_key = process.env.GOOGLE_MAP_API_KEY;
// const HtmlWebpackPlugin = require('html-webpack-plugin');  
const path = require('path');

module.exports = {
  entry: './frontend/src/index.jsx',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'frontend/assets'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     inject: false,
  //     template: './frontend/src/index.html',

  //     // Pass the full url with the api key
  //     apiUrl: `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`,
  //   })
  // ],
};