import { TestBed, inject } from '@angular/core/testing';

import { PokeGatherService } from './poke-gather.service';

describe('PokeGatherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokeGatherService]
    });
  });

  it('should be created', inject([PokeGatherService], (service: PokeGatherService) => {
    expect(service).toBeTruthy();
  }));
});
