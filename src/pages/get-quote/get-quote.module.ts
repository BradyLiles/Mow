import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GetQuotePage } from './get-quote';

@NgModule({
  declarations: [
    GetQuotePage,
  ],
  imports: [
    IonicPageModule.forChild(GetQuotePage),
    TranslateModule.forChild()
  ],
  exports: [
    GetQuotePage
  ]
})
export class GetQuotePageModule { }
