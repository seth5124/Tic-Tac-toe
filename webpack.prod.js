const path = require('path');
const common = require('./webpack.common.js')
const {merge} = require('webpack-merge');
module.exports = merge(common, {
  mode: "development",
    output:{
        filename: "app.[contenthash].js",
        path: path.resolve(__dirname, 'DIST'),
        clean: true,
    },

});
