import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whistlecoach.app',
  appName: 'Whistle Coach',
  webDir: 'dist',
  server: {
    // During development, point to the live URL so you can iterate
    // without rebuilding. Comment this out for production builds
    // (Capacitor will serve from the bundled dist/ folder instead).
    // url: 'https://www.whistlecoach.com',
    // androidScheme: 'https',
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#16a34a',          // matches your theme-color
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',                      // light text on dark/green bar
      backgroundColor: '#16a34a',
    },
    Keyboard: {
      resize: 'body',                      // resize viewport when keyboard opens
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'automatic',             // safe-area handling
    allowsLinkPreview: false,
    scrollEnabled: false,                  // let the React app handle scrolling
    scheme: 'Whistle Coach',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,    // set true while debugging
  },
};

export default config;
