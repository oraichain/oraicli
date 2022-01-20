require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: ['@babel/plugin-transform-runtime']
});
require('./run');
