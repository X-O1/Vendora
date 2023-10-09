const path = require("path");

module.exports = {
  entry: "./src/EthersApp.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      // Add aliases for your modules here
      "@FrontEndElements": path.resolve(__dirname, "src/FrontEndElements.js"),
      "@LocalStorage": path.resolve(__dirname, "src/LocalStorage.js"),
      "@ManageTradeList": path.resolve(__dirname, "src/ManageTradeList.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
};
