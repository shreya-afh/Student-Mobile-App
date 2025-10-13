import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.infosys.afh.student',
  appName: 'AFH Student App',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // For local development: replace with your computer's IP address
    // Example: url: 'http://192.168.1.100:5000'
    // Find your IP: ipconfig getifaddr en0 (Mac) or ipconfig (Windows)
    url: process.env.CAPACITOR_SERVER_URL || undefined,
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
