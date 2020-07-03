import { TestBed } from '@angular/core/testing';

import { ReferenceFactory } from './reference-factory';

describe('InputReferenceParserService', () => {
  let service: ReferenceFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
