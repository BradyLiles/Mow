import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController, Platform, ToastController, ViewController} from 'ionic-angular';
import {User} from '../../providers';
import {LoginPage} from "../login/login";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GoogleMapsProvider} from "../../providers/google-maps/google-maps";
import { } from '@types/googlemaps';
import {Geolocation} from "@ionic-native/geolocation";

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
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              private formBuilder: FormBuilder,
              public zone: NgZone,
              public googleMapsProvider: GoogleMapsProvider,
              public platform: Platform,
              public viewCtrl: ViewController,
  ) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      // this.signupErrorString = value;
    });

    this.searchDisabled = true;
    this.saveDisabled = true;

  }

  ionViewDidLoad(): void {
    let mapLoaded = this.googleMapsProvider.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.googleMapsProvider.map);
      this.searchDisabled = false;

    });
  }

  public getQuoteForm: FormGroup = this.formBuilder.group({
    [this.fields.CustomerFullAddress]: ['', Validators.required],
  });

  getQuote() {
  }

  navigateToSignIn() {
    this.navCtrl.push(LoginPage);
  }



  selectPlace(place){

    this.places = [];

    let location = {
      lat: null,
      lng: null,
      name: place.name
    };

    this.placesService.getDetails({placeId: place.place_id}, (details) => {

      this.zone.run(() => {

        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.saveDisabled = false;

        this.googleMapsProvider.map.setCenter({lat: location.lat, lng: location.lng});

        this.location = location;

      });

    });

  }

  searchPlace(){

    this.saveDisabled = true;

    if(this.query.length > 0 && !this.searchDisabled) {

      let config = {
        types: ['geocode'],
        input: this.query
      };

      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

        if(status == google.maps.places.PlacesServiceStatus.OK && predictions){

          this.places = [];

          predictions.forEach((prediction) => {
            this.places.push(prediction);
          });
        }

      });

    } else {
      this.places = [];
    }

  }

  save(){
    this.viewCtrl.dismiss(this.location);
  }

  close(){
    this.viewCtrl.dismiss();
  }









  /* doSignup() {
     // Attempt to login in through our User service
     this.user.signup(this.account).subscribe((resp) => {
       this.navCtrl.push(MainPage);
     }, (err) => {

       this.navCtrl.push(MainPage);

       // Unable to sign up
       let toast = this.toastCtrl.create({
         message: this.signupErrorString,
         duration: 3000,
         position: 'top'
       });
       toast.present();
     });
   }*/
}
