import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.infosys.afh.student',
  appName: 'AFH Student App',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
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
