import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.infosys.afh.student',
  appName: 'AFH Student App',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Backend server URL for Android app
    url: 'http://192.168.29.88:5000',
    cleartext: true, // Allow HTTP for local development
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
