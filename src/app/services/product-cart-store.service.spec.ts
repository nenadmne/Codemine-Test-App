import { TestBed } from '@angular/core/testing';

import { ProductCartStoreService } from './product-cart-store.service';

describe('ProductCartStoreService', () => {
  let service: ProductCartStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCartStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
