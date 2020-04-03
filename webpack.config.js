const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWepackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const paths = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, "./dist")
};

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    second: "./src/second_page.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "js/[name].[hash].js"
  },
  devtool: "inline-source-map",
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader"
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      }
    ]
  },
  devServer: {
    overlay: true,
    contentBase: paths.dist,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "style/[name].[hash].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "./index.html",
      inject: true
    }),
    new CopyWepackPlugin([
      { from: `${paths.src}/img`, to: `${paths.dist}/img` },
      { from: `${paths.src}/fonts`, to: `${paths.dist}/fonts` }
    ]),
    new CleanWebpackPlugin()
  ]
};
