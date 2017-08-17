import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PokeGatherService {

  baseUrl: string;
  pageLength: number;
  cachedPokemon: any;
  cachedEvolutions: any;
  cachedLocations: any;
  cachedBerries: any;

  constructor(private http: Http) {
    this.baseUrl = 'https://pokeapi.co/api/v2/';
    this.pageLength = 20;
    this.cachedPokemon = [];
    this.cachedEvolutions = [];
    this.cachedLocations = [];
    this.cachedBerries = [];
  }

  getData(dataUrl) {
    return this.http.get(dataUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSectionData(section, page) {
    return this.http.get(this.baseUrl + section + '/?limit=' + this.pageLength + '&offset=' + page)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCachedData(type) {
    const cacheCheck = localStorage.getItem('osbPocketPoke.' + type);
    if (cacheCheck && type === 'pokemon') {
      this.cachedPokemon = JSON.parse(cacheCheck);
    } else if (cacheCheck && type === 'evolutions') {
      this.cachedEvolutions = JSON.parse(cacheCheck);
    } else if (cacheCheck && type === 'locations') {
      this.cachedLocations = JSON.parse(cacheCheck);
    } else if (cacheCheck && type === 'berries') {
      this.cachedBerries = JSON.parse(cacheCheck);
    }
  }

  checkCachedData(type, data) {
    let cachedVersion = '';
    if (type === 'pokemon') {
      this.cachedPokemon.forEach((item) => {
        if (item.name === data.name) {
          cachedVersion = item;
        }
      });
    } else if (type === 'evolutions') {
      this.cachedEvolutions.forEach((item) => {
        if (item.url === data.url) {
          cachedVersion = item;
        }
      });
    } else if (type === 'locations') {
      this.cachedLocations.forEach((item) => {
        if (item.name === data.name) {
          cachedVersion = item;
        }
      });
    } else if (type === 'berries') {
      this.cachedBerries.forEach((item) => {
        if (item.name === data.name) {
          cachedVersion = item;
        }
      });
    }
    return cachedVersion;
  }

  cacheData(type, data) {
    let cacheDataDetails;
    switch (type) {
      case 'pokemon':
        this.cachedPokemon.push(data);
        cacheDataDetails = this.cachedPokemon;
        break;
      case 'evolutions':
        this.cachedEvolutions.push(data);
        cacheDataDetails = this.cachedEvolutions;
        break;
      case 'locations':
        this.cachedLocations.push(data);
        cacheDataDetails = this.cachedLocations;
        break;
      case 'berries':
        this.cachedBerries.push(data);
        cacheDataDetails = this.cachedBerries;
        break;
    }
    localStorage.setItem('osbPocketPoke.' + type, JSON.stringify(cacheDataDetails));
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
