import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PokedexComponent } from './pokedex/pokedex.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { EvolutionsComponent } from './evolutions/evolutions.component';
import { LocationsComponent } from './locations/locations.component';
import { BerriesComponent } from './berries/berries.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PokedexComponent,
    MainNavComponent,
    EvolutionsComponent,
    LocationsComponent,
    BerriesComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
