const webpack = require("webpack");

module.exports = function override(config, env) {
  console.log("override");
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
    tls: false,
    net: false,
    url: require.resolve("url"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    zlib: require.resolve("browserify-zlib"),
    buffer: require.resolve("buffer") 
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};
