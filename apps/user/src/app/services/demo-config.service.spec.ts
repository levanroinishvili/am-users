import { TestBed } from '@angular/core/testing';

import { DemoConfigService } from './demo-config.service';

describe('DemoConfigService', () => {
  let service: DemoConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
