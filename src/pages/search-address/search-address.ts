import {Component, ViewChild} from '@angular/core';
import {IonicPage, Keyboard, NavController, NavParams, Searchbar, ViewController} from 'ionic-angular';
import {GoogleMapsProvider} from "../../providers/google-maps/google-maps";


@IonicPage()
@Component({
  selector: 'page-search-address',
  templateUrl: 'search-address.html',
})
export class SearchAddressPage {

  query: string = '';
  places: any = [];
  autocompleteService: any;
  placesService: any;
  @ViewChild('addressSearchBar') searchBar: Searchbar;

  constructor(private keyboard: Keyboard, public navCtrl: NavController, public viewCtrl: ViewController, private navParams: NavParams, public googleMapsProvider: GoogleMapsProvider) {
  }


  ionViewDidEnter(): void {


    this.query = this.navParams.data.description;
    if( this.query ) {
      this.searchPlace();
    }


    setTimeout(() => {
      this.searchBar.setFocus();
    }, 150);
  }

  ngAfterViewChecked() {
    // if(this.searchBar) {
    //   this.searchBar.setFocus();
    // }
  }

  ionViewDidLoad(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  public searchPlace(){

    if(this.query.length > 0) {

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

  public dismissModal() {
    this.viewCtrl.dismiss();
  }

  public selectPlace(place){
    this.query = place.description;
    this.viewCtrl.dismiss(place);
    this.places = [];
  }
}
