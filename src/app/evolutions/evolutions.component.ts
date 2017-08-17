import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeGatherService } from '../poke-gather.service';

declare let ScrollMagic;

@Component({
  selector: 'app-evolutions',
  templateUrl: './evolutions.component.html',
  providers: [ PokeGatherService ]
})
export class EvolutionsComponent implements OnInit, OnDestroy {

  evolutions: any;
  evolutionList: any;
  loading: boolean;
  page: number;
  pageCount: number;
  pageLength: number;
  errorMessage: any;
  pageController: any;
  pageScene: any;

  constructor(private pokeGatherService: PokeGatherService) { }

  ngOnInit() {
    this.evolutions = [];
    this.page = 0;
    this.pageCount = 0;
    this.pageLength = 20;
    this.loading = true;
    this.pokeGatherService.getCachedData('evolutions');
    this.getEvolutions(false);
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

  getEvolutions(isNew) {
    this.pokeGatherService.getSectionData('evolution-chain', this.page).subscribe(
      evolutions => this.setEvolutionSectionDetails(evolutions, isNew),
      error =>  this.errorMessage = <any>error);
  }

  setEvolutionSectionDetails(evolutions, isNew) {
    let resultCount = 0;
    let cacheResult = true;
    if (isNew) {
      cacheResult = false;
      const newEvolutions = evolutions.results;
      newEvolutions.forEach((evolutionItem) => {
        this.getEvolutionDetails(evolutionItem.url, cacheResult);
      });
      return false;
    }

    this.evolutionList = evolutions.results;
    this.evolutionList.forEach((evolutionItem) => {
      resultCount++;
      if (resultCount >= this.pageLength * (this.pageCount + 1)) {
        this.startScroller();
      }
      const cacheCheck = this.pokeGatherService.checkCachedData('evolutions', evolutionItem);
      if (cacheCheck) {
        this.evolutions.push(cacheCheck);
        this.loading = false;
        return false;
      }
      this.getEvolutionDetails(evolutionItem.url, cacheResult);
    });
  }

  getEvolutionDetails(evolution, cache) {
    this.pokeGatherService.getData(evolution).subscribe(
      evolutionDetails => this.setEvolutionDetails(evolutionDetails, evolution, cache),
      error =>  this.errorMessage = <any>error);
  }

  setEvolutionDetails(evolution, url, cache) {
    evolution.url = url;
    this.evolutions.push(evolution);
    if (cache) {
      this.pokeGatherService.cacheData('evolutions', evolution);
    }
    this.loading = false;
  }

  startScroller() {
    this.pageController = new ScrollMagic.Controller();
    setTimeout(() => {
      this.pageScene = new ScrollMagic.Scene({triggerElement: '#evolutions-loading-trigger', triggerHook: 'onEnter'})
        .addTo(this.pageController)
        .on('enter', (e) => {
          document.querySelector('#evolutions-loading-trigger').classList.add('active');
          this.pageCount = this.pageCount + 1;
          this.page = this.pageLength * this.pageCount;
          this.getEvolutions(true);
        });
      this.pageScene.update();
    }, 1500);
  }

}
