import {Component, ElementRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  IonicPage,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from 'ionic-angular';
import {User} from '../../providers';
import {GoogleMapsProvider} from "../../providers/google-maps/google-maps";
import {} from '@types/googlemaps';
import {SearchAddressPage} from "../search-address/search-address";

@IonicPage()
@Component({
  selector: 'page-get-quote',
  templateUrl: 'get-quote.html'
})
export class GetQuotePage {

  private readonly fields = GetQuotePage.AvailableFields;

  public static AvailableFields = class {
    public static readonly CustomerFullAddress = 'customer.fullAddress';
  };

  @ViewChild('map') mapElement: ElementRef;

  public customerFullAddress = {};

  query: string = '';
  location: any;

  constructor(
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public googleMapsProvider: GoogleMapsProvider,
    public platform: Platform,
    public modalCtrl: ModalController
  ) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      // this.signupErrorString = value;
    });
  }

  ionViewDidLoad(): void {
    // Make sure the user can not open up the navigational menu from this page
    if (this.menuCtrl.isOpen()) {
      this.menuCtrl.close();
    }
    this.menuCtrl.enable(false);

    let mapLoaded = this.googleMapsProvider.init(null, null).then(() => {
    });
  }

  getQuote() {
  }

  navigateToSignIn() {
    this.navCtrl.push('LoginPage');
  }

  presentSearchAddressModal() {
    let searchAddressPage = this.modalCtrl.create('SearchAddressPage', this.customerFullAddress, {cssClass: "modal-fullscreen"});
    searchAddressPage.onDidDismiss(data => {
      if (data) {
        this.customerFullAddress = data;
      }
    });
    searchAddressPage.present();
  }

}
