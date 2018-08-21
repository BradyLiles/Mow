import { NgModule } from '@angular/core';
import { GoogleLoginComponent } from './google-login/google-login';
import {IonicModule} from "ionic-angular";

export const components = [
  GoogleLoginComponent,
];

@NgModule({
	declarations: [components],
	imports: [IonicModule],
	exports: [components]
})
export class ComponentsModule {}
