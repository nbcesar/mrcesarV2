import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LandingPage } from '../pages/landing/landing';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private zone: NgZone
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAlOEP2BRgnfWTCjm7ccBb686uUjJsI9T0",
      authDomain: "collegesearch-272e4.firebaseapp.com",
      databaseURL: "https://collegesearch-272e4.firebaseio.com",
      storageBucket: "collegesearch-272e4.appspot.com",
      messagingSenderId: "232604844315"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.zone.run(() => {
          this.nav.setRoot(TabsPage);
        });
        //this.nav.setRoot(TabsPage);
      } else {
        // No user is signed in.
        this.nav.setRoot(LandingPage);
      }
    });
  }

}
