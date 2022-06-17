const {
  override,
  disableEsLint,
  addWebpackResolve,
  useBabelRc,
} = require("customize-cra");
const path = require('path');

module.exports = override(
  disableEsLint(),
  useBabelRc(),
  addWebpackResolve({
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  })
);
