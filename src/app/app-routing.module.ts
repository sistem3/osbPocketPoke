import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PokedexComponent } from './pokedex/pokedex.component';
import { EvolutionsComponent } from './evolutions/evolutions.component';
import { LocationsComponent } from './locations/locations.component';
import { BerriesComponent } from './berries/berries.component';

export const routes: Routes = [
  {
    path: '',
    component: PokedexComponent
  },
  {
    path: 'evolutions',
    pathMatch: 'full',
    component: EvolutionsComponent
  },
  {
    path: 'locations',
    pathMatch: 'full',
    component: LocationsComponent
  },
  {
    path: 'berries',
    pathMatch: 'full',
    component: BerriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
