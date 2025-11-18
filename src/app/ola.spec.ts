import { TestBed } from '@angular/core/testing';

import { Ola } from './ola';

describe('Ola', () => {
  let service: Ola;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ola);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
