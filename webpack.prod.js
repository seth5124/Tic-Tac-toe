const path = require('path');
const common = require('./webpack.common.js')
const {merge} = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
    output:{
        filename: "app.[contenthash].js",
        path: path.resolve(__dirname, 'DIST'),
        clean: true,
    },
    optimization:{
        minimizer: [new CssMinimizerPlugin(),
                    new TerserPlugin()],
    },

});

