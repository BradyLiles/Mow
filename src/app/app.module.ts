import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Pro } from '@ionic/pro';
import { AngularFireModule } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus';
import { Items } from '../mocks/providers/items';
import { Settings, User, Api } from '../providers';
import { MyApp } from './app.component';
import {AngularFireAuth} from "angularfire2/auth";
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import {Geolocation} from "@ionic-native/geolocation";
import {Network} from "@ionic-native/network";

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


Pro.init('ec04ea1b', {
  appVersion: '0.0.1'
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

const firebaseConfig = {
    apiKey: 'AIzaSyCriHQl34-yxkRCfaqvrWw927J8ZfAXm_8',
    authDomain: 'mowapp-81689.firebaseapp.com',
    // databaseURL: '<your-database-URL>',
    projectId: 'mowapp-81689',
    // storageBucket: '<your-storage-bucket>',
    // messagingSenderId: '<your-messaging-sender-id>'
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    GooglePlus,
    SplashScreen,
    StatusBar,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    AngularFireAuth,

    // Keep this to enable Ionic's runtime error handling during development
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }],

    Network,
    Geolocation,
    ConnectivityServiceProvider,
    GoogleMapsProvider
  ],
  exports: [
  ]
})
export class AppModule { }
