import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, Products, SearchParams, PaginationParams } from '../../Types';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  private currentSearchParams: SearchParams = { q: '' };
  private currentPaginationParams: PaginationParams = { limit: 5, skip: 0 };

  constructor(private productsService: ProductsService) {}

  fetchAllProducts(limit: number, skip: number, value?: string) {
    this.currentPaginationParams = { limit, skip };
    if (value !== '') {
      const combinedParams = {
        ...this.currentSearchParams,
        ...this.currentPaginationParams,
      };
      this.productsService
        .getProducts('https://dummyjson.com/products/search', combinedParams)
        .subscribe((products: Products) => {
          this.productsSubject.next(products.products);
          this.totalItemsSubject.next(products.total);
        });
    } else {
      this.productsService
        .getProducts(
          'https://dummyjson.com/products',
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
        .searchProducts('https://dummyjson.com/products/search', combinedParams)
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
