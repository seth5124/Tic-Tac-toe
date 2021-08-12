const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: "./src/index.js",
    output: {
      assetModuleFilename: "assets/imgs/[name].[hash].[ext]",
    },
    plugins: [new HtmlWebpackPlugin({
      template: "./src/template.html"
    })],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.html$/i,
          use: ["html-loader"]
        },
        {
          test:/\.(svg|png)$/i,
          type:'asset/resource',
        },
        {
          test:/\.otf$/i,
          type:'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash].ext'
          },

        }
      ],
    },
};

