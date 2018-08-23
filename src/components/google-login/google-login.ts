import {Component} from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {GooglePlus} from '@ionic-native/google-plus';
import {Platform} from 'ionic-angular';
import {UserInfo} from 'firebase';
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";

/**
 * Generated class for the GoogleLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {

  text: string;
  user: Observable<UserInfo>;

  constructor(private afAuth: AngularFireAuth,
              private gplus: GooglePlus,
              private facebook: Facebook,
              private platform: Platform) {

    this.user = this.afAuth.authState;
  }

  async nativeGoogleLogin(): Promise<void> {
    try {

      const gplusUser = await this.gplus.login({
        'webClientId': '1073721764009-33pqigak26e8q0t9cd9mgum4u9pctkno.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });
      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then(() => null);
    } catch (err) {
      console.log(err)
    }
  }

  async nativeFacebookLogin(): Promise<void> {
    try {

      const fbUser = await this.facebook.login(['public_profile', 'email']);

      return await this.afAuth.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(fbUser.authResponse.accessToken)).then(() => null);
    } catch (err) {
      console.log(err)
    }
  }


  registerUser() {
    firebase.auth().createUserWithEmailAndPassword( "dash3k3@gmail.com", "jackle74")
      .then((response: any) => {
        let userCreated = firebase.auth().currentUser;
        userCreated.updateProfile({
          displayName: "",
          photoURL: ""
        });
      }).catch((erro) => {
      console.log('create user error', erro);
    });
  }

  userCredentialLogin() {
    firebase.auth().signInWithEmailAndPassword("dash3k3@gmail.com", "jackle74").catch(function(error) {
      console.log('errors', error);
    });
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webLogin( new firebase.auth.GoogleAuthProvider() );
    }
  }

  facebookLogin() {
    if (this.platform.is('cordova')) {
      this.nativeFacebookLogin()
    } else {
      this.webLogin( new firebase.auth.FacebookAuthProvider() );
    }
  }

  async webLogin(provider: firebase.auth.AuthProvider, credentialToLink: any = null ): Promise<void> {
    try {
      const credential = await this.afAuth.auth.signInWithPopup(provider)
        .then((authUserResponse: firebase.auth.UserCredential) => {
          if(credentialToLink != null) {
            authUserResponse.user.linkAndRetrieveDataWithCredential(credentialToLink).then((response) => {
              console.log('Successfully linked?', response);
            }).catch((err2) => {
              console.log('linked failed!', err2)
            });
          }
        })
        .catch((signInError: any) => {
          if (signInError.code == 'auth/account-exists-with-different-credential' && _.isString((signInError as any).email)) {
            this.afAuth.auth.fetchSignInMethodsForEmail((signInError as any).email)
              .then(providers => {

                let providerToLink = null;
                if(providers[0] == 'google.com') {
                  providerToLink = new firebase.auth.GoogleAuthProvider();
                  providerToLink.setCustomParameters({login_hint: signInError.email});
                } else if ( providers[0] == 'password' ) {
                  providerToLink = new firebase.auth.EmailAuthProvider();
                }

                if(providerToLink != null) {
                  return this.webLogin( providerToLink, signInError.credential );
                }
              })
          }
        })
    }
    catch (err) {
    }
  }

  signOut()
  {
    this.afAuth.auth.signOut();
  }
}

