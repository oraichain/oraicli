/* eslint global-require: off */

module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', '@babel/preset-flow'],
    plugins: ['@babel/plugin-transform-runtime']
  };
};
