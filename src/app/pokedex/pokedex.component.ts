import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokeGatherService } from '../poke-gather.service';

declare let ScrollMagic;

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  providers: [ PokeGatherService ]
})
export class PokedexComponent implements OnInit, OnDestroy {

  pokemon: any;
  pokemonList: any;
  page: number;
  pageCount: number;
  pageLength: number;
  errorMessage: any;
  loading: boolean;
  pageController: any;
  pageScene: any;
  showModal: boolean;
  modalContent: any;

  constructor(private pokeGatherService: PokeGatherService) { }

  ngOnInit() {
    this.loading = true;
    this.showModal = false;
    this.page = 0;
    this.pageCount = 0;
    this.pageLength = 20;
    this.pokemon = [];
    this.pokeGatherService.getCachedData('pokemon');
    this.getPokemonDetails(false);
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

  startModal(pokemon) {
    this.modalContent = pokemon;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalContent = null;
  }

  capturePokemon(pokemon) {
    console.log('Gotta catch em all...');
    console.log(pokemon);
  }

  getPokemonDetails(isNew) {
    this.pokeGatherService.getSectionData('pokemon', this.page).subscribe(
      pokemon => this.setPokeSectionDetails(pokemon, isNew),
      error =>  this.errorMessage = <any>error);
  }

  setPokeSectionDetails(pokemon: any, isNew) {
    let resultCount = 0;
    let cacheResult = true;
    if (isNew) {
      cacheResult = false;
      const newPokemon = pokemon.results;
      newPokemon.forEach((pokemonItem) => {
        this.getPokeDetails(pokemonItem.url, cacheResult);
      });
      return false;
    }
    this.pokemonList = pokemon.results;
    this.pokemonList.forEach((pokemonItem) => {
      resultCount++;
      if (resultCount >= this.pageLength * (this.pageCount + 1)) {
        this.startScroller();
      }
      const cacheCheck = this.pokeGatherService.checkCachedData('pokemon', pokemonItem);
      if (cacheCheck && cacheResult) {
        this.pokemon.push(cacheCheck);
        this.loading = false;
        return false;
      }
      this.getPokeDetails(pokemonItem.url, cacheResult);
    });
  }

  getPokeDetails(pokemon, cache) {
    this.pokeGatherService.getData(pokemon).subscribe(
      pokemonDetails => this.setPokeDetails(pokemonDetails, cache),
      error =>  this.errorMessage = <any>error);
  }

  setPokeDetails(pokemon, cache) {
    this.pokemon.push(pokemon);
    if (cache) {
      this.pokeGatherService.cacheData('pokemon', pokemon);
    }
    this.loading = false;
  }

  startScroller() {
    this.pageController = new ScrollMagic.Controller();
    setTimeout(() => {
      this.pageScene = new ScrollMagic.Scene({triggerElement: '#loading-trigger', triggerHook: 'onEnter'})
        .addTo(this.pageController)
        .on('enter', (e) => {
          document.querySelector('#loading-trigger').classList.add('active');
          this.pageCount = this.pageCount + 1;
          this.page = this.pageLength * this.pageCount;
          this.getPokemonDetails(true);
        });
      this.pageScene.update();
    }, 1500);
  }

}
