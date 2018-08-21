import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicPageModule} from 'ionic-angular';

import {LoginPage} from './login';
import {GoogleLoginComponent} from "../../components/google-login/google-login";

@NgModule({
  declarations: [
    LoginPage,
    GoogleLoginComponent

  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()
  ],
  entryComponents: [
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {
}
