import { TestBed } from '@angular/core/testing';

import { WppService } from './wpp.service';

describe('WppService', () => {
  let service: WppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
