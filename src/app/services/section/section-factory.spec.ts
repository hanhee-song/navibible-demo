import { TestBed } from '@angular/core/testing';

import { SectionFactory } from './section-factory';

describe('SectionFactoryService', () => {
  let service: SectionFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
