const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Expo Go uyumluluğu için
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config; 