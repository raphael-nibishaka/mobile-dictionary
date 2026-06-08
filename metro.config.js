const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = withNativeWind(getDefaultConfig(__dirname), {
  input: './src/global.css',
});

// Bind all interfaces so Android emulator can reach Metro via adb reverse / LAN
config.server = {
  ...config.server,
  host: '0.0.0.0',
};

module.exports = config;
