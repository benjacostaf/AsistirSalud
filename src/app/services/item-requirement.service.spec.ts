import { TestBed } from '@angular/core/testing';

import { ItemRequirementService } from './item-requirement.service';

describe('ItemRequirementService', () => {
  let service: ItemRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
