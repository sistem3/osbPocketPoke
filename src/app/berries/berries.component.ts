import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeGatherService } from '../poke-gather.service';

declare let ScrollMagic;

@Component({
  selector: 'app-berries',
  templateUrl: './berries.component.html',
  providers: [ PokeGatherService ]
})
export class BerriesComponent implements OnInit, OnDestroy {

  loading: boolean;
  berries: any;
  berriesList: any;
  page: number;
  pageCount: number;
  pageLength: number;
  errorMessage: any;
  pageController: any;
  pageScene: any;

  constructor(private pokeGatherService: PokeGatherService) { }

  ngOnInit() {
    this.loading = true;
    this.berries = [];
    this.page = 0;
    this.pageCount = 0;
    this.pageLength = 20;
    this.pokeGatherService.getCachedData('berries');
    this.getBerriesDetails(false);
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

  getBerriesDetails(isNew) {
    this.pokeGatherService.getSectionData('berry', this.page).subscribe(
      berries => this.setBerrySectionDetails(berries, isNew),
      error =>  this.errorMessage = <any>error);
  }

  setBerrySectionDetails(berries, isNew) {
    let resultCount = 0;
    let cacheResult = true;
    if (isNew) {
      cacheResult = false;
      const newPokemon = berries.results;
      newPokemon.forEach((berriesItem) => {
        this.getBerryDetails(berriesItem.url, cacheResult);
      });
      return false;
    }
    this.berriesList = berries.results;
    this.berriesList.forEach((berryItem) => {
      resultCount++;
      if (resultCount >= this.pageLength * (this.pageCount + 1)) {
        this.startScroller();
      }
      const cacheCheck = this.pokeGatherService.checkCachedData('berries', berryItem);
      if (cacheCheck) {
        this.berries.push(cacheCheck);
        this.loading = false;
        return false;
      }
      this.getBerryDetails(berryItem.url, isNew);
    });
  }

  getBerryDetails(berry, cache) {
    this.pokeGatherService.getData(berry).subscribe(
      berryDetails => this.setBerryDetails(berryDetails, cache),
      error =>  this.errorMessage = <any>error);
  }

  setBerryDetails(berry, cache) {
    this.berries.push(berry);
    if (cache) {
      this.pokeGatherService.cacheData('berries', berry);
    }
    this.loading = false;
  }

  startScroller() {
    this.pageController = new ScrollMagic.Controller();
    setTimeout(() => {
      this.pageScene = new ScrollMagic.Scene({triggerElement: '#berries-loading-trigger', triggerHook: 'onEnter'})
        .addTo(this.pageController)
        .on('enter', (e) => {
          document.querySelector('#berries-loading-trigger').classList.add('active');
          this.pageCount = this.pageCount + 1;
          this.page = this.pageLength * this.pageCount;
          this.getBerriesDetails(true);
        });
      this.pageScene.update();
    }, 1500);
  }

}
