import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeGatherService } from '../poke-gather.service';

declare let ScrollMagic;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  providers: [ PokeGatherService ]
})
export class LocationsComponent implements OnInit, OnDestroy {

  loading: boolean;
  locations: any;
  locationsList: any;
  page: number;
  pageCount: number;
  pageLength: number;
  errorMessage: any;
  pageController: any;
  pageScene: any;

  constructor(private pokeGatherService: PokeGatherService) { }

  ngOnInit() {
    this.locations = [];
    this.page = 0;
    this.pageCount = 0;
    this.pageLength = 20;
    this.loading = false;
    this.pokeGatherService.getCachedData('locations');
    this.getLocations(false);
  }

  ngOnDestroy() {
    if (this.pageController != null) {
      this.pageController.destroy();
      this.pageController = null;
    }

    if (this.pageScene != null) {
      this.pageScene.destroy();
      this.pageScene = null;
    }
  }

  getLocations(isNew) {
    this.pokeGatherService.getSectionData('location', this.page).subscribe(
      locations => this.setLocationSectionDetails(locations, isNew),
      error =>  this.errorMessage = <any>error);
  }

  setLocationSectionDetails(locations, isNew) {
    let resultCount = 0;
    let cacheResult = true;
    if (isNew) {
      cacheResult = false;
      const newLocations = locations.results;
      newLocations.forEach((locationItem) => {
        this.getLocationDetails(locationItem.url, cacheResult);
      });
      return false;
    }

    this.locationsList = locations.results;
    this.locationsList.forEach((locationItem) => {
      resultCount++;
      if (resultCount >= this.pageLength * (this.pageCount + 1)) {
        this.startScroller();
      }
      const cacheCheck = this.pokeGatherService.checkCachedData('locations', locationItem);
      if (cacheCheck) {
        this.locations.push(cacheCheck);
        this.loading = false;
        return false;
      }
      this.getLocationDetails(locationItem.url, cacheResult);
    });
  }

  getLocationDetails(location, cache) {
    this.pokeGatherService.getData(location).subscribe(
      locationDetails => this.setLocationDetails(locationDetails, cache),
      error =>  this.errorMessage = <any>error);
  }

  setLocationDetails(location, cache) {
    this.locations.push(location);
    if (cache) {
      this.pokeGatherService.cacheData('locations', location);
    }
    this.loading = false;
  }

  startScroller() {
    this.pageController = new ScrollMagic.Controller();
    setTimeout(() => {
      this.pageScene = new ScrollMagic.Scene({triggerElement: '#locations-loading-trigger', triggerHook: 'onEnter'})
        .addTo(this.pageController)
        .on('enter', (e) => {
          document.querySelector('#locations-loading-trigger').classList.add('active');
          this.pageCount = this.pageCount + 1;
          this.page = this.pageLength * this.pageCount;
          this.getLocations(true);
        });
      this.pageScene.update();
    }, 1500);
  }
}
