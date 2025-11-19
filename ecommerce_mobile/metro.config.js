const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle module resolution issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Reset cache on startup
config.resetCache = true;

// Disable TurboModules temporarily to avoid compatibility issues
config.transformer.unstable_allowRequireContext = true;

module.exports = config;
