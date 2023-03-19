import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBarStyle } from '@capacitor/status-bar/dist/esm/definitions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}

  initializeApp() {
    if (Capacitor.isNative) {
      SplashScreen.show({
        autoHide: true,
      });

      StatusBar.setBackgroundColor({ color: '#ffffff' });
      StatusBar.setStyle({ style: StatusBarStyle.Dark });

      SplashScreen.show();
    }
  }
}
