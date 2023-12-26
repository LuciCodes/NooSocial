// Import path for resolving file paths
var path = require("path");

module.exports = {
  // Specify the entry point for our app.
  entry: [path.join(__dirname, "bundle-imports.js")],
  // Specify the output file containing our bundled code.
  output: {
    path: __dirname,
    filename: 'noosocial-bundle.js'
  },
   // Enable WebPack to use the 'path' package.
   resolve:{
	fallback: { path: require.resolve("path-browserify")}
  }
};