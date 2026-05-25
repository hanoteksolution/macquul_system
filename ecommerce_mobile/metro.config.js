const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// SDK 54: disable lazy bundles (avoids dev-server URL / protocol crashes on device)
process.env.EXPO_NO_METRO_LAZY = '1';

const config = getDefaultConfig(__dirname);
const assetUrisShim = path.resolve(__dirname, 'shims/AssetUris.js');

config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.transformer.unstable_allowRequireContext = true;

const upstreamResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const origin = context.originModulePath || '';
  const isAssetUris =
    moduleName === './AssetUris' ||
    moduleName.endsWith('/AssetUris') ||
    moduleName.endsWith('AssetUris.js') ||
    (origin.includes('expo-asset') && /AssetUris/.test(moduleName));

  if (isAssetUris) {
    return { type: 'sourceFile', filePath: assetUrisShim };
  }

  if (upstreamResolve) {
    return upstreamResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
