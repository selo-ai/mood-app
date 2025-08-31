module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // React Navigation için gerekli
      'react-native-reanimated/plugin',
    ],
  };
}; 