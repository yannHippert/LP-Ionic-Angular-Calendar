import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Ionic Calendar',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'smallicon',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
  },
};

export default config;
