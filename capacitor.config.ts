import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zokys.app',
  appName: 'LowestWePlay',
  webDir: 'dist',
  server: {
    url: 'https://1bec52bd-fe58-4f8d-a34d-9ce3714d9316.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: { allowMixedContent: true },
  plugins: {
    SplashScreen: { launchShowDuration: 1500, backgroundColor: '#ffffff' },
  },
};

export default config;
