const path = require('path');
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output:{
        filename: 'app.js',
        path: path.resolve(__dirname, 'DIST')
    },
 module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

