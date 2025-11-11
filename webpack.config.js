const path = require("path");
const merge = require("webpack-merge").merge;

// Merge with the base @wordpress/scripts webpack config so we keep all loaders/plugins
module.exports = (env) => {
  // Load the base config provided by @wordpress/scripts
  let baseConfig;
  try {
    baseConfig = require("@wordpress/scripts/config/webpack.config")(env);
  } catch (e) {
    // Fallback: if wp-scripts doesn't expose the function, attempt to require the package
    try {
      baseConfig = require("@wordpress/scripts/config/webpack.config");
    } catch (err) {
      // If we cannot load the base config, throw a helpful error.
      throw new Error(
        "Unable to load @wordpress/scripts webpack config. Make sure @wordpress/scripts is installed."
      );
    }
  }

  // Ensure both index and overlay entries are present so webpack emits both bundles.
  const custom = {
    entry: {
      index: path.resolve(__dirname, "src", "index.js"),
      overlay: path.resolve(__dirname, "src", "overlay.js"),
    },
    output: Object.assign({}, baseConfig.output || {}, {
      filename: "[name].js",
    }),
  };

  // Merge and return the resulting config. This will override the base entry
  // with our dual-entry object while preserving loaders/plugins from baseConfig.
  return merge(baseConfig, custom);
  // Merge and return the resulting config
  return merge(baseConfig, custom);
};

