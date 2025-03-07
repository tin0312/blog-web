const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "process/browser": require.resolve("process/browser.js"),
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser.js"),
  };

  config.plugins.push(
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );

  return config;
};
