const path = require("path");

module.exports = {
  entry:  {
    index: ['babel-polyfill', "./client/index.js"]
  },
  output: {
    path: path.join(__dirname, "./public/"),
    //publicPath: '/public',
    filename: "index-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
  ]
};