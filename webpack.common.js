const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: "./src/index.js",

    plugins: [
      new HtmlWebpackPlugin({
      template: "./src/template.html"
    }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      })],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.html$/i,
          use: ["html-loader"]
        },
        {
          test:/\.(svg|png)$/i,
          type:'asset/resource',
          generator: {
            filename: 'assets/imgs/[name].[contenthash].[ext]'
          }
        },
        {
          test:/\.otf$/i,
          type:'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash].[ext]'
          },

        }
      ],
    },
};

