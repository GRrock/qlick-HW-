const path = require('path');

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  mode: 'production',
  //mode: 'development',
  output: {
    path: path.resolve(__dirname, 'out'),
    libraryTarget: 'amd',
    filename: 'svgTestGrigorev.js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /.html$/,
        loader: 'html-loader'
      },
      {
        test: /.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
};