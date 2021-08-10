const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {

    entry: "./src/index.js",
    plugins: [new HtmlWebpackPlugin({
      template: "./src/template.html",
    })],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test:/\.html$/i,
          use: ['html-loader'],
        },
        {
          test:/\.(svg|png|jpg|jpeg|gif)$/i,
          use: {
            loader: "file-loader",
            options:{
              name: "[name].[hash].[ext]",
              outputPath:'imgs',
            }
          }
        }
      ],
    },
};

