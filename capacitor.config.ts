import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.infosys.afh.student',
  appName: 'AFH Student App',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // For Android Emulator: 10.0.2.2 maps to host machine's localhost
    // For Real Device: use your Mac's IP (e.g., http://192.168.29.88:5000)
    url: 'http://10.0.2.2:5000',
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
