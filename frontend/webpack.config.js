module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./src/main.js"],
  output: {
    path: __dirname + "/public/dist/",
    filename: "main.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/dist"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: false,
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  devtool: "source-map",
  devServer: {
    contentBase: "public/",
    hot: false,
    historyApiFallback: true,
    port: 9080
  }
};
