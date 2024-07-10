import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, Products, SearchParams, PaginationParams } from '../../Types';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly API_PRODUCTS = 'https://dummyjson.com/products';
  readonly API_PRODUCTS_SEARCH = 'https://dummyjson.com/products/search';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private currentSearchParams: SearchParams = { q: '' };
  private currentPaginationParams: PaginationParams = { limit: 5, skip: 0 };

  products$ = this.productsSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor(private productsService: ProductsService) {}

  fetchAllProducts(limit: number, skip: number, value?: string) {
    this.currentPaginationParams = { limit, skip };
    if (value !== '') {
      const combinedParams = {
        ...this.currentSearchParams,
        ...this.currentPaginationParams,
      };
      this.productsService
        .getProducts(this.API_PRODUCTS_SEARCH, combinedParams)
        .subscribe((products: Products) => {
          this.productsSubject.next(products.products);
          this.totalItemsSubject.next(products.total);
        });
    } else {
      this.productsService
        .getProducts(
          this.API_PRODUCTS,
          this.currentPaginationParams
        )
        .subscribe((products: Products) => {
          this.productsSubject.next(products.products);
          this.totalItemsSubject.next(products.total);
        });
    }
  }

  fetchProducts(keyword: string) {
    this.currentSearchParams = { q: keyword };
    // this.currentPaginationParams.skip = 0; // Reset skip when search query changes
    if (!this.currentSearchParams.q) {
      this.fetchAllProducts(this.currentPaginationParams.limit, 0);
    } else {
      const combinedParams = {
        ...this.currentSearchParams,
        ...this.currentPaginationParams,
      };
      this.productsService
        .searchProducts(this.API_PRODUCTS_SEARCH, combinedParams)
        .subscribe((products: Products) => {
          this.productsSubject.next(products.products);
          this.totalItemsSubject.next(products.total);
        });
    }
  }

  getCurrentPaginationParams(): PaginationParams {
    return this.currentPaginationParams;
  }

  updatePaginationParams(limit: number, skip: number) {
    this.currentPaginationParams = { limit, skip };
  }
}
