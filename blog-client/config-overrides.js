const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add the NodePolyfillPlugin to the plugins array
  config.plugins.push(
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );
  return config;
};
