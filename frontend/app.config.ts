import type { ExpoConfig } from 'expo/config';

const appJson = require('./app.json');
const base: ExpoConfig = appJson.expo;

export default (): ExpoConfig => ({
  ...base,
  ios: {
    ...base.ios,
    config: {
      ...(base.ios?.config ?? {}),
      googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    ...base.android,
    config: {
      ...(base.android?.config ?? {}),
      googleMaps: {
        apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  },
});
